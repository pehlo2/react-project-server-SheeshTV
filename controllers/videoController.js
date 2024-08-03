const router = require('express').Router();
const videoManager = require('../managers/videoManager.js');
const { isAuth } = require('../middlewares/authMiddleware.js');
const Video = require('../models/Video.js');
const upload = require('../middlewares/upload.js')
const extractImage = require('../utils/imageExtractor.js')
const commentManager = require('../managers/commentsManager.js');
const { BASE_URL_FOR_AVATARS, BASE_URL_FOR_VIDEOS } = require('../utils/port.js');
const { changeOwnerAvatarUrl } = require('../utils/changeOwnerAvatarUrl.js');
const notificationManager = require('../managers/notificationsManager.js');


const fs = require('fs').promises

router.post('/upload', upload.single('video'), async (req, res) => {
  try {


    let lastPeriodIndex = req.file.path.lastIndexOf('.')
    let imagePath = req.file.path.substring(0, lastPeriodIndex + 1) + 'jpg'
    extractImage(req.file.path, imagePath)
    const video = new Video({
      title: req.body.title,
      owner: req.body.userId,
      description: req.body.description,
      gameChoice: req.body.gameChoice,
      videoUrl: req.file.location,
      thumbnail: imagePath
    });
    const savedVideo = await video.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});




router.get('/', async (req, res) => {

  const currentUserId = req.user?._id
  const whereQuery = req.query.where
  const searchQuery = req.query.search
  const page = req.query.page
  const limit = req.query.limit
  let videos;
  const queryParams = new URLSearchParams(whereQuery);
  const gameChoice = queryParams.get('gameChoice');


  try {
    videos = await videoManager.getAll(currentUserId, gameChoice, searchQuery, page, limit).populate('owner')

    const videosResult = changeOwnerAvatarUrl(videos)
    res.json(videosResult)

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

}
)



router.get('/user-videos', async (req, res) => {
  let whereQuery = req.query.where
  let limit = req.query.limit
  let page = req.query.page
  if (!whereQuery) {
    return

  }

  try {
    const queryParams = new URLSearchParams(whereQuery);
    const profileId = queryParams.get('profileId');
    if (!profileId) {
      return res.status(400).json({ message: 'Profile ID not found in query' });
    }



    const videos = await videoManager.getAllByOwnerId(profileId, limit, page).populate('owner')
    let videoResults = changeOwnerAvatarUrl(videos)

    res.json(videoResults)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

}
)




















router.get('/:videoId', async (req, res) => {

  try {
    const video = await videoManager.getOne(req.params.videoId).populate('owner')
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    video.viewCount += 1;
    await video.save();
    video.owner.avatar = `${BASE_URL_FOR_AVATARS}${video.owner.avatar}`
    video.videoUrl = `${BASE_URL_FOR_VIDEOS}${video.videoUrl.split('/').pop()}`
    console.log(video);
    res.json(video)

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

}



)


router.post('/:videoId/like', async (req, res) => {
  const videoId = req.params.videoId
  const authorName = req.user?.username
  const userId = req.user?._id
  console.log(videoId,
    authorName,
    userId);
  try {

    const video = await videoManager.getOne(videoId).populate('owner');
    const userToSendNotification = video.owner;




    if (req.user._id !== userToSendNotification._id.toString()) {

      const notification = await notificationManager.createNotification({ text: null, videoId, userToSendNotification: userToSendNotification._id, authorName, authorId: userId, type: 'liked' })
      await notification.save();

      if (userToSendNotification.socketId) {
        req.io.to(userToSendNotification.socketId).emit('notification', notification);
      }

    }


    if (!video) {
      return res.status(404).json({ message: 'Video not found' });

    }

    video.likes.push(req.body.userId);
    await video.save();
    res.json(video)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

}
)

router.post('/:videoId/dislike', async (req, res) => {
  try {
    const video = await videoManager.getOne(req.params.videoId)
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const userId = req.body.userId

    let index = video.likes.indexOf(userId)

    if (index !== -1) {

      video.likes.splice(index, 1)

    }

    await video.save();
    res.json(video)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

}
)
router.delete('/:videoId/delete', async (req, res) => {

  if (req.params.videoId === undefined) {
    return
  }
  try {
    const video = await videoManager.delete(req.params.videoId)
    await commentManager.deleteAllVideoComments(req.params.videoId)



    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await fs.unlink(video.videoUrl)
    await fs.unlink(video.thumbnail)

    res.json({ message: 'Video deleted successfully' })

  } catch (err) {
    res.status(500).json({ message: err.message });
  }


})

router.put('/:videoId/edit', async (req, res) => {


  try {
    const video = await videoManager.update(req.params.videoId, req.body)

    res.json(video)
  } catch (err) {

    res.status(500).json({ message: err.message });
  }

})
router.get('/videoCount/:userId', async (req, res) => {

  const userId = req.params.userId;
  try {
    const videoCount = await videoManager.getVideosCount(userId)
    res.json({ videoCount: videoCount })
  } catch (err) {

    res.status(500).json({ message: err.message });
  }

})

module.exports = router;

