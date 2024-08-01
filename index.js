const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const routes = require('./router.js');
const { auth } = require('./middlewares/authMiddleware.js');
const { port, origin ,socketPort} = require('./utils/port.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorMiddleware.js');
const http = require('http');

const dotenv = require('dotenv');
const initializeSocket = require('./utils/socket.js'); 

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


const User = require('./models/User.js');

const server = http.createServer(app);

// Initialize socket server on a different port
const socketServer = http.createServer();
const io = initializeSocket(socketServer);



app.get('/', (req, res) => {
  res.json(process.env);
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(routes);

server.listen(port, () => console.log(`Server started on port ${port}`));
socketServer.listen(socketPort, () => console.log(`Socket.io server started on port ${socketPort}`));
