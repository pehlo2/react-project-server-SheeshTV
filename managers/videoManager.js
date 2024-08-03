const Video = require('../models/Video.js');


exports.getAll = (currentUserId, gameChoice, searchQuery,page,limit) => {





  let filter = {
    $or: [
      { owner: { $ne: currentUserId } },
      { owner: { $exists: false } }
    ]
  }

  if (gameChoice) {
    filter.gameChoice = gameChoice
  }
  if (searchQuery) {
    filter.title = { $regex: searchQuery, $options: 'i' }

  }

  let videos = Video.find(filter).limit(limit).skip((page - 1) * limit)
  


 
  return videos



}


exports.getAllByOwnerId = (profileId,limit,page) => Video.find({ owner: profileId }).limit(limit).skip((page - 1) * limit).sort({ created_at: -1 });
exports.getOne = (videoId) => Video.findById(videoId)
exports.create = (videoData) => Video.create(videoData)
exports.update = (videoId, videoData) => Video.findByIdAndUpdate(videoId, videoData, { new: true })
exports.delete = (videoId) => Video.findByIdAndDelete(videoId)
exports.getLastThree = () => Video.find().limit(3).sort({ created_at: -1 })
exports.getVideosCount = (userId) => Video.countDocuments({ owner: userId })
