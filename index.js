const express = require('express');
const app = express();
const path = require('path');
const routes = require('./router.js');
const mongoose = require('mongoose')
const { auth } = require('./middlewares/authMiddleware.js');
const dotenv = require('dotenv').config()


mongoose.connect(process?.env?.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/SheeshTV').then(() => console.log('DB connected')).catch(err => console.log(err));


const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser())
const errorHandler = require('./middlewares/errorMiddleware.js');
const { port ,origin } = require('./utils/port.js');
var corsOptions = {
  origin: origin,
  optionsSuccessStatus: 200,
  credentials: true
}

app.use(cors(corsOptions));
app.use(auth);

app.use('/data/videos', express.static(path.join(__dirname, 'videos')));
app.use('/users/avatar', express.static(path.join(__dirname, 'avatar')));



app.use(errorHandler);



app.get('/', (req, res) => {
  res.json('Hello Server');


});


///middleware///
app.use((req, res, next) => {
  req.io = io;
  next();
});




app.use(routes);
app.listen(port, () => console.log(`Server Start port ${port}`));



