 const port =  process.env.PORT || 3000
 const BASE_URL_FOR_AVATARS = `http://localhost:${port}/users/`
 const BASE_URL_FOR_VIDEOS = `http://localhost:${port}/data/`
 module.exports = {port ,BASE_URL_FOR_AVATARS,BASE_URL_FOR_VIDEOS}