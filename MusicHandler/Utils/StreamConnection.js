const { joinVoiceChannel } = require('@discordjs/voice')

class StreamConnection{

    join(voiceInfo){
        return joinVoiceChannel({
            channelId: voiceInfo.voice.channel.id,
            guildId: voiceInfo.guild.id,
            adapterCreator: voiceInfo.guild.voiceAdapterCreator
        })
    }

    leave(connection){
        if(connection) connection.destroy()
    }

    setVoice(resource, value){
        if(value > 100){
            value = 1.0
            resource.volume.setVolume(value)
        } else if(value < 0){
            value = 0
            resource.volume.setVolume(value)
        }
        else {
            resource.volume.setVolume(value / 100)
        }
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