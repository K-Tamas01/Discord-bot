const { joinVoiceChannel } = require('@discordjs/voice')

class StreamConnection{

    join(voiceInfo){
        return joinVoiceChannel({
            channelId: voiceInfo.channelid,
            guildId: voiceInfo.guildId,
            adapterCreator: voiceInfo.voiceAdapterCreator
        })
    }

    leave(connection){
        if(connection) connection.destroy()
        return undefined
    }

    setVoice(resource, value){
       let volume = value / 100
       if(volume < 0.0){
        volume = 0.0
       } else if(volume > 1.0){
        volume = 1.0
       }

       resource.volume.setVolume(volume)
    }

    stop(player){
        if(player.state.status === 'playing'){
            player.unpause()
        }
    }

    start(player){
        if(player.state.status === 'pause'){
            player.pause()
        }
    }
}

module.exports = StreamConnection