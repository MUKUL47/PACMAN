const express = require('express')
const app = express()
const request = require('request')
const firebase = require('firebase')
const bodyParser = require("body-parser");
require('dotenv').config()
const server= require('http').createServer(app)
const path = require('path');

server.listen(process.env.PORT)

app.use(express.static(path.join(__dirname, '../')));
app.use(integrateClientIpId)
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

firebase.initializeApp({
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId
})

app.get('/', (req, res) => res.sendFile('index.html'))
app.get('/getConfigs', getConfigs)
app.post('/storeConfigs', storeConfigs)
app.delete('/deleteConfig/:configId', deleteConfig)


function getIp(){
    return new Promise((resolve, reject) => {
        request.get('https://ipinfo.io', (err, resp, body) => {
            if(err) {
                reject(err)
                return
            }
            resolve(JSON.parse(body)['ip'])
        })
    })
}

function getClientId(){
    return new Promise(async (resolve, reject) => {
        try{
            const ip = await getIp()
            resolve(ip.split('.').join('').split('').map(c => String.fromCharCode(Number(c)+65)).join(''))
        }
        catch(err){
            reject(err)
        }
    })
}

async function integrateClientIpId(req, res, next){
    try{
        req['currentClientId'] = await getClientId()
        next()
    }catch(_){
        next()
    }
}

async function firebaseShortcut(crudType, data){
    try{
        if(crudType == 'GET'){
            const response =  await firebase.database().ref(process.env.rootPath + data.path).once('value')
            return response.toJSON()
        }
        else if(crudType == 'POST'){
            return firebase.database().
            ref(process.env.rootPath + data.path).push().set
            ({storedAt : new Date().valueOf(), config : data.config, name : data.configName});
        }
        return firebase.database().ref(process.env.rootPath + data.path).remove()
    }catch(e){
        return false;
    }
}

async function getConfigs(req, res){
    try{
        const response = await firebaseShortcut('GET', { path : '/'+req.currentClientId })
        console.log(response)
        res.send(response == 'null' ? {} : response)
    }
    catch(err){
        res.status(500).send()
    }
}

async function storeConfigs(req, res){
    try{
        const data = { 
            path : '/'+req.currentClientId, 
            config : req.body.config, 
            configName : req.body.configName
        }
        await firebaseShortcut('POST', data)
        res.status(201).send(await firebaseShortcut('GET', { path : '/'+req.currentClientId }))
    }
    catch(err){
        res.status(500).send()
    }
}

async function deleteConfig(req, res){
    try{
        await firebaseShortcut('DELETE', { path : `/${req.currentClientId}/${req.params.configId}` })
        res.status(204).send()
    }
    catch(err){
        res.status(500).send()
    }
}