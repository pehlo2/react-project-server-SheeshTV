const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: [5, 'Username should be at least 5 characters']
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Email already exists'],
        minLength: [6, 'Email should be at least 10 characters']
    },
    password: {
        type: String,
        required: true,
        minLength: [6, 'Password should be at least 10 characters']
    },
    avatar: {
        type: String,
        default: 'https://sheeshtv.s3.eu-north-1.amazonaws.com/avatar/defaultAvatar.jpg'
    },
    description: {
        type: String,
        required: true,
        default: 'Gamers',
        minLength: [5, 'Description should be at least 10 characters']
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    socketId: { type: String }
}, { timestamps: { createdAt: 'created_at' } });

userSchema.pre('save', async function () {
    if (!this.isNew) {
        return;
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
