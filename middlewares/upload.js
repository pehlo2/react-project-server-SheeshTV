
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const path = require('path');
require('dotenv').config();

// AWS S3 configuration
aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.BUCKET_REGION,
});

const s3 = new aws.S3();


const storage = multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    acl: 'public-read', 
    key: function (req, file, cb) {
        cb(null, `videos/${Date.now()}_${path.basename(file.originalname)}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 20000000 
    }
});

module.exports = upload;