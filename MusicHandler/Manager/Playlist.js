const play_dl = require('play-dl')
const { createAudioResource } = require('@discordjs/voice')

class PlayList{
    constructor(){
        this.options = {
            quality: 2,
            format: 'mp3',
        }
    }

    async play(content){
        const is_url = content.startsWith('http')
        const resource = []
        if(is_url){
            const playlistInfo = await play_dl.playlist_info(content)
            for(let track of playlistInfo.tracks){
                const stream = await play_dl.stream(track, this.options)
                resource.push(createAudioResource(stream.stream, {
                    inlineVolume: true,
                    inputType: stream.type
                }))
            }
        }
        return resource
    }
}

module.exports = PlayList