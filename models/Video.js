const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: [3, 'Title should be at least 3 characters']
    },
    description: {
        type: String,
        required: true,
        minLength: [6, 'Descrition should be at least 6 characters']
    },
    videoUrl: String,
    thumbnail: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    gameChoice: {
        type: String,
        enum: ['Valorant', 'Counter Strike 2', 'Fortnite', 'League of Legends', 'Minecraft', 'Apex Legends', 'GTA V', 'World Of Warcraft','Overwatch'],
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    viewCount: {
        type: Number,
        default: 0
    }

}, { timestamps: { createdAt: 'created_at' } });

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;