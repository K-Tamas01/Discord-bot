const play_dl = require('play-dl')

class PlayList{

    async play(content){
        if(content.startsWith('http')){
            const playlistInfo = await play_dl.playlist_info(content, {incomplete: true})
            return playlistInfo
        }
    }
}

module.exports = PlayList