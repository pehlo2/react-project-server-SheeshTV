const AWS = require('aws-sdk');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const s3 = new AWS.S3();
const bucketName = 'sheeshtv';

const extractImage = (videoUrl, imagePath) => {
    return new Promise((resolve, reject) => {
        const tempFilePath = path.join(__dirname, 'temp-video.mp4');
        const tempImagePath = path.join(__dirname, 'temp-image.jpg');

     
        const videoKey = decodeURIComponent(new URL(videoUrl).pathname.substring(1)); 
        console.log('Video Key:', videoKey);

    
        const videoStream = fs.createWriteStream(tempFilePath);
        s3.getObject({ Bucket: bucketName, Key: videoKey })
            .createReadStream()
            .on('error', (err) => {
                console.error('Error downloading video from S3:', err); 
                reject(err);
            })
            .pipe(videoStream);

        videoStream.on('finish', () => {
         
            ffmpeg(tempFilePath)
                .screenshots({
                    count: 1,
                    folder: __dirname,
                    filename: 'temp-image.jpg',
                })
                .on('end', () => {
                   
                    const fileContent = fs.readFileSync(tempImagePath);
                    const params = {
                        Bucket: bucketName,
                        Key: imagePath,
                        Body: fileContent,
                        ContentType: 'image/jpeg'
                    };

                   

                    s3.upload(params, (err, data) => {
                        if (err) {
                            console.error('Upload Error:', err); 
                            reject(err);
                        } else {
                         
                            
                            fs.unlinkSync(tempFilePath);
                            fs.unlinkSync(tempImagePath);
                            resolve(data.Location);
                        }
                    });
                })
                .on('error', (err) => {
                    console.error('FFmpeg Error:', err); 
                    reject(err);
                });
        });

        videoStream.on('error', (err) => {
            console.error('Video Stream Error:', err); 
            reject(err);
        });
    });
};

module.exports = extractImage;
