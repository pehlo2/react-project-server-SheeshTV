require('dotenv').config();

console.log('Bucket Name:', process.env.BUCKET_NAME);
console.log('Bucket Region:', process.env.BUCKET_REGION);
console.log('Access Key ID:', process.env.ACCESS_KEY);
console.log('Secret Access Key:', process.env.SECRET_ACCESS_KEY);

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

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
