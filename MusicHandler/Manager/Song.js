const EventEmmitter = require('events')
const play_yt = require('play-dl')
const { createAudioResource } = require('@discordjs/voice')

class Song extends EventEmmitter{
    constructor(){
        super()
        this.options = {
            quality: 2,
            format: 'mp3',
        }
    }

    async play(content){
        const is_url = content.startsWith('https')
        if(is_url){
            const stream = await play_yt.stream(content, this.options)
            const resource = createAudioResource(stream.stream, {
                inlineVolume: true,
                inputType: stream.type
            })
            
            return resource
        } else {
            const searchInfo = await play_yt.search(content, { source : { youtube : "video" }, limit: 1 })
            const stream = await play_yt.stream(searchInfo[0].url, this.options)
            const resource = createAudioResource(stream.stream, {
                inlineVolume: true,
                inputType: stream.type
            })

            return resource
        }
    }
}

module.exports = Song