const play_yt = require('play-dl')

class Song{

    async play(content){
            const searchInfo = await play_yt.search(content, {source: { youtube: "video"}, limit: 1 })
            return searchInfo
    }
}

module.exports = Song