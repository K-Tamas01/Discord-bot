const play_dl = require('play-dl')

class PlayList{

    async play(content){
        const is_url = content.startsWith('http')
        if(is_url){
            const playlistInfo = await play_dl.playlist_info(content, {incomplete: true})
            return playlistInfo
        }
    }
}

module.exports = PlayList