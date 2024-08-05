
const router = require('express').Router();
const commentManager = require('../managers/commentsManager.js');
const Notification = require('../models/Notifications.js');
const { changeOwnerAvatarUrl } = require('../utils/changeOwnerAvatarUrl.js');
const notificationManager = require('../managers/notificationsManager.js');
const Video = require('../models/Video.js');
const io = require('../utils/socket.js')


router.post('/', async (req, res) => {


  try {

    const text = req.body.text;
    const videoId = req.body.videoId;
    const author = req.body.userId
    const authorName = req.body.username




    let comment = await commentManager.create(
      {
        videoId,
        text,
        author
      }
    )



    const video = await Video.findById(videoId).populate('owner');


    const userToSendNotification = video.owner;

    

    if (req.user._id !== userToSendNotification._id.toString()) {

      const notification = await notificationManager.createNotification({ text, videoId, userToSendNotification: userToSendNotification._id, authorName, authorId: author, type: 'commented' })
      await notification.save();



      if (userToSendNotification.socketId) {
        req.io.to(userToSendNotification.socketId).emit('notification', notification);
      }

    }




    res.status(201).json(comment);


  } catch (err) {

    res.status(500).json({ err: err.message })
  }

})



router.get('/', async (req, res) => {
  let query = req.query.where

  if (!query) {
    return

  }
  try {

    const videoId = query.substring(9, 33)
    const comments = await commentManager.AllVideoComments(videoId).populate('author')
    
    return res.status(201).json(comments)

  } catch (err) {
    res.status(500).json({ err: err.message })
  }

})



router.get('/:commentId', async (req, res) => {
  let commentId = req.params.commentId
  try {
    let comment = await commentManager.getOneById(commentId).populate('author')
    res.status(201).json(comment)
  } catch (err) {
    res.status(500).json({ err: err.message })

  }

})



router.put('/:commentId', async (req, res) => {
  let text = req.body
  let commentId = req.params.commentId
  try {
    let comment = await commentManager.updateComment(commentId, text).populate('author')
    res.status(200).json(comment)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }

})


router.delete('/:commentId', async (req, res) => {


  
  try {
    await commentManager.deleteComment(req.params.commentId)

    res.status(204).json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ err: err.message })
  }


})
module.exports = router;