
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const path = require('path');
require('dotenv').config();

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKeyId = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

console.log('Bucket Name:', bucketName);
console.log('Bucket Region:', bucketRegion);
console.log('Access Key:', accessKeyId);
console.log('Secret Access Key:', secretAccessKey);

aws.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: bucketRegion,
});

const s3 = new aws.S3();


const storage = multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
        cb(null, 'avatar/' + Date.now().toString() + '-' + file.originalname);
    }
});


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2000000
    }
});

module.exports = upload;