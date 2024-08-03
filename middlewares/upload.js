
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const path = require('path');
require('dotenv').config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

console.log('Bucket Name:', bucketName);
console.log('Bucket Region:', bucketRegion);
console.log('Access Key ID:', accessKeyId);
console.log('Secret Access Key:', secretAccessKey);
aws.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: bucketRegion,
});

const s3 = new aws.S3();
console.log('AWS S3 Configuration:', s3.config);

const storage = multerS3({
    s3: s3,
    bucket: bucketName,
    acl: 'public-read',
    key: function (req, file, cb) {
        console.log('Uploading to bucket:', bucketName);
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
