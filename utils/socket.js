// socketHandler.js
const User = require('../models/User');

module.exports = (io) => {
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
};