
const ffmpeg = require('ffmpeg');

const extractImage =(videoPath, imagePath) =>{
    try {
      var process = new ffmpeg(videoPath);
      process.then(function (video) {
        video.addCommand('-ss', `${Math.ceil(video.metadata.duration.seconds)}`)
        video.addCommand('-vframes', '1')
        video.save(imagePath, function (error, file) {
  
          if (error) {
            console.log(error);
          }
  
  
          if (!error)
            console.log(video.metadata.duration);
  
          console.log('Video file: ' + file);
        });
      }, function (err) {
        console.log('Error: ' + err);
      });
    } catch (e) {
      console.log(e.code);
      console.log(e.msg);
    }
  }

  module.exports = extractImage