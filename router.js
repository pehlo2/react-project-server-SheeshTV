const express = require('express');
const router = express.Router();

const userControllers = require('./controllers/userController.js');
const videoController = require('./controllers/videoController.js');
const commentsController = require('./controllers/commentsController.js');
const notificationsController = require('./controllers/notificationsController.js');

router.use('/comments', commentsController);
router.use('/users', userControllers);
router.use('/data/videos', videoController);
router.use('/notifications', notificationsController);

module.exports = router;
