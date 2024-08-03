const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt.js');
const { json } = require('express');

exports.getUserToFollow = (userToFollowId) => User.findById(userToFollowId)
exports.getUserToUnFollow = (userToUnFollowId) => User.findById(userToUnFollowId)


exports.updateProfile = async (userId, userData) => {

    const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true })
    return updatedUser
}



exports.register = async (userData) => {
    const userExistCheck = await User.findOne({ email: userData.email });

    if (userExistCheck) {

        throw new Error('This email address is already used.');
    }


    const user = await User.create(userData);

    const result = await getAuthResult(user);
    return result;


}



exports.login = async ({ email, password }) => {
    const user = await User.findOne({ email });


    if (!user) {
        throw new Error('Invalid email or password.');
    }
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Invalid email or password.');
    };

    const result = await getAuthResult(user);



    return result;




}
exports.profileInfo = async (id) => {
    const user = await User.findById(id).populate('followers')
    return user
}


exports.getAllUsers = async (userId, searchQuery) => {
 console.log(userId);
    const filter = {
        _id: { $ne: userId },
    };
    if (searchQuery) {
        filter.username = { $regex: searchQuery, $options: 'i' }

    }

    const users = await User.find(filter)
    return users
}




async function getAuthResult(user) {

    const payload = {
        username: user.username,
        _id: user._id,
        email: user.email,
    };
    const token = await jwt.sign(payload, 'SECRETSSERCRET');

    const result = {
        _id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        accessToken: token,
    };

    return result;

}