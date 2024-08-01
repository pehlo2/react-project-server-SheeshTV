const port = process.env.PORT || 3000
const socketPort = 5000
const origin ='http://localhost:5173'
const host = 'http://localhost:3000'


const BASE_URL_FOR_AVATARS = `${host}/users/`
const BASE_URL_FOR_VIDEOS = `${host}/data/`
module.exports = {
    port, BASE_URL_FOR_AVATARS, BASE_URL_FOR_VIDEOS, origin,
    host,socketPort
}
