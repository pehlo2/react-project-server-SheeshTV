const Comment = require('../models/Comment')
exports.deleteAllVideoComments = (videoId)=> Comment.deleteMany({videoId})
exports.updateComment = (commentId,commentText)=> Comment.findByIdAndUpdate(commentId,commentText)
exports.deleteComment = (commentId) => Comment.findByIdAndDelete(commentId);
exports.getOneById = (commentId) => Comment.findById(commentId);
exports.AllVideoComments = (videoId) => Comment.find({ videoId: videoId });
exports.AllComments = () => Comment.find();
exports.create = ({ videoId, text,author }) => Comment.create({ videoId,text,author})
