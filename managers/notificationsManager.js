const Notification = require('../models/Notifications');

exports.getNotifications = (userId) => Notification.find({
    userToSendNotification: userId


}).sort({
    createdAt: -1
});







exports.createNotification = ({ text, videoId, userToSendNotification, authorName, authorId, type }) => {



    const notificationData = {
        authorId,
        authorName,
        type,
    };



    if (text) {
        notificationData.text = text;
    }

    if (videoId) {
        notificationData.videoId = videoId;
    }

    if (userToSendNotification) {
        notificationData.userToSendNotification = userToSendNotification;
    }



    const notification = Notification.create(notificationData)
    return notification

}

exports.deleteNotification = (notificationId) => Notification.findByIdAndDelete(notificationId)
exports.markAsRead = (notificationId) => Notification.findByIdAndUpdate(notificationId, { read: true })

exports.deleteAllNotifications = (userId) => Notification.deleteMany({ userToSendNotification: userId });
exports.markAllAsRead = (userId) => Notification.updateMany(
    { userToSendNotification: userId },
    { $set: { read: true } }
);