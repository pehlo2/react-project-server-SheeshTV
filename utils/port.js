const port = process.env.PORT || 3000
const socketPort = process.env.SPORT || 5000
const origin = process.env.ORIGIN || 'http://localhost:5173'
const host = process.env.SERVER_DATA_URI || 'http://localhost:3000'
console.log(host);

const BASE_URL_FOR_AVATARS = `${host}/users/`
const BASE_URL_FOR_VIDEOS = `${host}/data/`
module.exports = {
    port, BASE_URL_FOR_AVATARS, BASE_URL_FOR_VIDEOS, origin,
    host,socketPort
}
