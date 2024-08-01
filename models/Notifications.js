const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    userToSendNotification: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    authorName: {
        type: String,
        required: true
    },
    authorId :{
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: false
    },

    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Notification', notificationSchema);