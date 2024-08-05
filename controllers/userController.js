const router = require('express').Router();
const userManager = require('../managers/userManager.js')
const shoeManager = require('../managers/videoManager.js');
const uploadAvatar = require('../middlewares/uploadAvatar.js');
const { changeOwnerAvatarUrl } = require('../utils/changeOwnerAvatarUrl.js');
const { BASE_URL_FOR_AVATARS } = require('../utils/port.js');
const notificationManager = require('../managers/notificationsManager.js');
const Video = require('../models/Video.js');
const User = require('../models/User.js');



const authCookieName = 'auth-cookie'
const fs = require('fs').promises





router.get('/', async (req, res) => {




    try {
        const userId = req.user?._id

        const searchQuery = req.query.search

        const users = await userManager.getAllUsers(userId, searchQuery)


        res.json(users)

    } catch (err) {
        res.status(401).json({
            message: err.message
        })

    }



})

router.post('/register', async (req, res) => {

    try {

        const result = await userManager.register(req.body)
        res.cookie(authCookieName, result.accessToken, { httpOnly: true, sameSite: 'none', secure: true })
        res.json(result)
    } catch (err) {
        res.status(401).json({

            message: err.message
        })
    };
});

router.post('/login', async (req, res) => {


    try {
        const result = await userManager.login(req.body);



        res.cookie(authCookieName, result.accessToken, { httpOnly: true })
        res.json(result)

    } catch (err) {

        res.status(401).json({
            message: err.message
        })

    }


});


router.get('/logout', (req, res) => {

    res.clearCookie('auth-cookie')
    res.status(204)
    res.end()
});

router.get('/:profileId', async (req, res) => {


    try {

        let user = await userManager.profileInfo(req.params.profileId)

        let result = {
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            _id: user._id,
            description: user.description,
            createdAt: user.created_at,
            followers: user.followers
        }
        res.status(200).json(result)

    } catch (err) {

        res.status(400).json({
            message: err.message,

        })

    }

});
router.post('/follow', async (req, res) => {
    const userId = req.user?._id
    const userToFollowId = req.body.userToFollowId
    const authorName = req.user?.username


    if (userId === userToFollowId) {
        throw new Error("You can't follow yourself.")
    }
    try {
        let userToFollow = await userManager.getUserToFollow(userToFollowId)
        if (userToFollow.followers.includes(userId)) {
            throw new Error("Alredy followed")
        }

        userToFollow.followers.push(userId);
        await userToFollow.save();



        if (req.user._id !== userToFollowId) {

            const notification = await notificationManager.createNotification({ text: null, videoId: null, userToSendNotification: userToFollowId, authorName, authorId: userId, type: 'followed' })
            await notification.save();


            if (userToFollow.socketId) {
                req.io.to(userToFollow.socketId).emit('notification', notification);
            }

        }





        res.json(userToFollow)



    } catch (err) {

        res.status(400).json({
            message: err.message,

        })
    }

});
router.post('/unfollow', async (req, res) => {
    const userId = req.user?._id
    const userToUnfollowId = req.body.userToUnfollowId
    if (userId === userToUnfollowId) {
        throw new Error("You can't unfollow yourself.")
    }

    try {

        let userToFollow = await userManager.getUserToUnFollow(userToUnfollowId)

        let index = userToFollow.followers.indexOf(userId)

        if (index !== -1) {
            userToFollow.followers.splice(index, 1)
        }
        await userToFollow.save();
        res.json(userToFollow)

    } catch (err) {

        res.status(400).json({
            message: err.message,

        })
    }

});




const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKeyId = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY
AWS.config.update({
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },

    region: bucketRegion,
});



router.put('/:userId/update', uploadAvatar.single('avatar'), async (req, res) => {


    let avatarToDeleteUrl = req.body.avatarToDelete


    const userId = req.user?._id
    const userDataToUpdate = {
        email: req.body.email,
        description: req.body.description,
        username: req.body.username
    }



    if (req.file) {

        userDataToUpdate.avatar = req.file.location

        if (!avatarToDeleteUrl?.includes('avatarDefault')) {
            
            await deleteS3Objects(avatarToDeleteUrl);

        }

    }
    try {


        if (!req.body.email,
            !req.body.description,
            !req.body.username) {
            throw new Error('Fill all the fields')
        }


        const updatedUser = await userManager.updateProfile(userId, userDataToUpdate)
        res.json(updatedUser)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});





router.get('/:profileId/following', async (req, res) => {

    try {
        const profileId = req.params.profileId
        const followers = await User.find({ followers: profileId });



        res.json(followers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/:profileId/followers', async (req, res) => {

    try {
        const profileId = req.params.profileId
        const followers = await User.find({ followers: profileId });



        res.json(followers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const deleteS3Objects = async (filePath) => {

    const key = `avatar/${filePath.split('/').pop()}`;
  
    
    
    return s3.deleteObject({
        Bucket: bucketName,
        Key: key
    }).promise();
};

module.exports = router;
