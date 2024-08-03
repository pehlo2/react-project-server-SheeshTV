const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const routes = require('./router.js');
const { auth } = require('./middlewares/authMiddleware.js');
const { port, origin } = require('./utils/port.js');  // Remove socketPort if not needed
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorMiddleware.js');
const http = require('http');
const dotenv = require('dotenv');
const initializeSocket = require('./utils/socket.js');

dotenv.config();







mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/SheeshTV', {
})
  .then(() => console.log('DB connected'))
  .catch(err => console.log(err));

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: origin,
  optionsSuccessStatus: 200,
  credentials: true,
};
console.log(process.env);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://soft-uni-project-sheesh-tv.vercel.app');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(cors(corsOptions));
app.use(auth);
app.use('/data/videos', express.static(path.join(__dirname, 'videos')));
app.use('/users/avatar', express.static(path.join(__dirname, 'avatar')));
app.use(errorHandler);

const server = http.createServer(app);

const io = initializeSocket(server);

app.get('/', (req, res) => {
  res.send('Hello Server')
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(routes);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
