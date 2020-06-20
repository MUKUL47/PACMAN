const express = require('express')
const app = express()
require('dotenv').config()
const server= require('http').createServer(app)
const path = require('path');
app.use(express.static(path.join(__dirname, '../')));
app.get('/', (req, res) => res.sendFile('index.html'))
server.listen(process.env.PORT)
