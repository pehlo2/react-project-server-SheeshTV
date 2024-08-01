const socketIo = require('socket.io');
const User = require('../models/User');
 

function initializeSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: process.env.ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('register', async (userId) => {
      console.log(`User registered: ${userId}`);
      const user = await User.findById(userId);
      if (user) {
        user.socketId = socket.id;
        await user.save();
      }
    });

    socket.on('disconnect', async () => {
      console.log('Client disconnected');
      const user = await User.findOne({ socketId: socket.id });
      if (user) {
        user.socketId = null;
        await user.save();
      }
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err);
    });
  });

  return io;
}

module.exports = initializeSocket;
