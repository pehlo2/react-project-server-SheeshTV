// socketHandler.js
const { origin,socketPort } = require('./utils/port.js');
const User = require('../models/User');
const express = require('express');
const app = express();
const mongoose = require('mongoose')

mongoose.connect(process?.env?.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/SheeshTV').then(() => console.log('DB connected')).catch(err => console.log(err));

const http = require('http')
const socketIo = require('socket.io');


const server = http.createServer(app)

const io = socketIo(server, {
  cors: {
    origin: origin,
    methods: ['GET', 'POST']
  }
})



io.on('connection', (socket) => {
  socket.on('register', async (userId) => {
    const user = await User.findById(userId);
    if (user) {
      user.socketId = socket.id;
      await user.save();
    }
  });

  socket.on('disconnect', async () => {
    const user = await User.findOne({ socketId: socket.id });
    if (user) {
      user.socketId = null;
      await user.save();
    }
  });
});

io.listen(socketPort, () => console.log(`Server Start port ${socketPort}`));