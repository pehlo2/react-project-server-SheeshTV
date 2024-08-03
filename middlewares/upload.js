
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const path = require('path');
require('dotenv').config();

const bucketName =process.env.BUCKET_NAME
const bucketRegion=process.env.BUCKET_REGION
const accessKeyId =process.env.ACCESS_KEY
const secretAccessKey =process.env.SECRET_ACCESS_KEY



aws.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region:bucketRegion,
});

const s3 = new aws.S3();


const storage = multerS3({
    s3: s3,
    bucket: bucketName,
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