const base = 'http://localhost:3400'
async function getConfigs(){
    try{
        let response = await (await (await fetch(base+'/getConfigs')).json())
        return response
    }
    catch(err){
        console.log(err)
        return {}
    }
}

async function storeConfigs(config, configName){
    try{
        const body = JSON.stringify({ config : config, configName : configName})
        const header = { 'Content-Type': 'application/json', } 
        let response = await fetch(base+'/storeConfigs',{ method : 'POST', headers : header, body : body })
        response = await response.json()
        return await response
    }
    catch(err){
        console.log(err)
        return {}
    }
}

async function deleteConfig(configId){
    try{
        let response = await fetch(base+'/deleteConfig/'+configId, { method : 'DELETE'})
        response = await response.json()
        return await response
    }
    catch(err){
        console.log(err)
        return {}
    }
}