const express = require('express');
const app = express();

const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/SheeshTV').then(() => console.log('DB connected')).catch(err => console.log(err));






//////// socket.io///
const http = require('http')
const socketIo = require('socket.io');


const server = http.createServer(app)

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})




const socketHandler = require('./utils/socket.js');
socketHandler(io);



io.listen(5000, () => console.log(`Server Start port ${5000}`));


