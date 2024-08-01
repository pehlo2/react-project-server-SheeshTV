const { BASE_URL_FOR_AVATARS } = require("./port");

const changeOwnerAvatarUrl = (arr) => {
  

    arr.forEach((element) => {

        if (element.owner) {
            element.owner.avatar = `${BASE_URL_FOR_AVATARS}${element.owner.avatar.split('/').pop()}`
        }
        if (element.author) {
            element.author.avatar = `${BASE_URL_FOR_AVATARS}${element.author.avatar.split('/').pop()}`
        }
        if(element.avatar){
            element.avatar = `${BASE_URL_FOR_AVATARS}${element.avatar.split('/').pop()}`
        }

    })
   
    return arr
}




module.exports = { changeOwnerAvatarUrl }


