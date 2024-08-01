const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const routes = require('./router.js');
const { auth } = require('./middlewares/authMiddleware.js');
const { port, origin } = require('./utils/port.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorMiddleware.js');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process?.env?.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/SheeshTV')
  .then(() => console.log('DB connected'))
  .catch(err => console.log(err));

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

var corsOptions = {
  origin: origin,
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));
app.use(auth);
app.use('/data/videos', express.static(path.join(__dirname, 'videos')));
app.use('/users/avatar', express.static(path.join(__dirname, 'avatar')));
app.use(errorHandler);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});


const User = require('./models/User.js');

io.on('connection', (socket) => {
  console.log('New client connected');
  
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

app.get('/', (req, res) => {
  res.json(process.env);
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(routes);

server.listen(port, () => console.log(`Server started on port ${port}`));
