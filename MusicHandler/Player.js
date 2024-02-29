const EventEmitter = require('events')
const Queue = require('./Manager/Queue')
const StreamConnection = require('./Utils/StreamConnection')
const Song = require('./Manager/Song')
const Playlist = require('./Manager/Playlist')
const { createAudioPlayer, createAudioResource } = require('@discordjs/voice')
const play_yt = require('play-dl')

class Player extends EventEmitter{
    constructor(){
        super()
        this.StreamConnectionCollection = {}
        this.StreamConnection = new StreamConnection()
        this.Song = new Song()
        this.Playlist = new Playlist()
        this.options = {
            quality: 2,
            format: 'mp3',
        }
        this.getAudioAndPlay = async function(songInfo, guildId){
            const stream = await play_yt.stream(songInfo.url, this.options)
            const resource = createAudioResource(stream.stream, {
                inlineVolume: true,
                inputType: stream.type
            })
            this.StreamConnectionCollection[guildId].player.play(resource)
        }
    }

    createConnection(guildId, result, textChannel){
        this.StreamConnectionCollection[guildId] = {
            connection: this.StreamConnection.join({channelid: result.id, guildId: guildId, voiceAdapterCreator: result.guild.voiceAdapterCreator}),
            player: new createAudioPlayer(),
            subscribe: undefined,
            queue: new Queue(),
            status: undefined,
            textChannel: textChannel
        }
        this.StreamConnectionCollection[guildId].subscribe = this.StreamConnectionCollection[guildId].connection.subscribe(this.StreamConnectionCollection[guildId].player)
    }

    getConnections(guildId){
        return this.StreamConnectionCollection[guildId]
    }

    getQueue(guildId){
        return this.StreamConnectionCollection[guildId].queue
    }

    destroyQueue(guildId){
        return this.StreamConnectionCollection[guildId].queue.destroy()
    }

    remove(guild, index){
        return this.StreamConnectionCollection[guildId].queue.removeElement(index)
    }

    destroyConnection(guildId){
        this.StreamConnectionCollection[guildId].connection = this.StreamConnection.leave(this.StreamConnectionCollection[guildId].connection)
        delete this.StreamConnectionCollection[guildId]
    }

    skip(guildId){
        this.StreamConnectionCollection[guildId].player.stop()
    }

    pause(guildId){
        this.StreamConnectionCollection[guildId].player.pause()
    }

    unpause(guildId){
        this.StreamConnectionCollection[guildId].player.unpause()
    }

    join(data){
        const result = data.guild.channels.resolve(data.member.voice.channel.id)
        if(result){
            const guildId = result.guild.id
            if(!this.getConnections(guildId)){
                this.createConnection(guildId, result, data.channel)
            }
        }
    }

    async play(content, guildId){
        const songInfo = await this.Song.play(content)
        this.StreamConnectionCollection[guildId].queue.enqueue(songInfo[0])
        if(this.StreamConnectionCollection[guildId].player.state.status === 'idle') {
            this.getAudioAndPlay(songInfo[0], guildId)
            this.emit('firstSong', this.StreamConnectionCollection[guildId].textChannel, this.StreamConnectionCollection[guildId].queue.peek())
            this.StreamConnectionCollection[guildId].status = this.StreamConnectionCollection[guildId].player.on('stateChange', async (oldStatus, newStatus) => {
                if(newStatus.status === 'idle' && this.StreamConnectionCollection[guildId].queue.size() > 0){
                    this.emit('songChanged', this.StreamConnectionCollection[guildId].textChannel, this.StreamConnectionCollection[guildId].queue.dequeue(), this.StreamConnectionCollection[guildId].queue.peek())
                    this.getAudioAndPlay(this.StreamConnectionCollection[guildId].queue.dequeue(), guildId)
                }
                else if(newStatus.status === 'idle' && oldStatus.status !== 'idle'){
                    this.emit('queueEnd', this.StreamConnectionCollection[guildId].textChannel)
                    this.destroyConnection(guildId)
                }
            })
        }
    }

    async playList(content, guildId){
        const playListInfo = await this.Playlist.play(content)
        for(let track of playListInfo.videos){
            this.StreamConnectionCollection[guildId].queue.enqueue(track)
        }
        if(this.StreamConnectionCollection[guildId].player.state.status === 'idle') {
            this.getAudioAndPlay(playListInfo.videos[0], guildId)
            this.emit('firstSong', this.StreamConnectionCollection[guildId].textChannel, this.StreamConnectionCollection[guildId].queue.peek())
            this.StreamConnectionCollection[guildId].status = this.StreamConnectionCollection[guildId].player.on('stateChange', (oldStatus, newStatus) => {
                if(newStatus.status === 'idle' && this.StreamConnectionCollection[guildId].queue.size() > 0){
                    this.emit('songChanged', this.StreamConnectionCollection[guildId].textChannel, this.StreamConnectionCollection[guildId].queue.dequeue(), this.StreamConnectionCollection[guildId].queue.peek())
                    this.getAudioAndPlay(this.StreamConnectionCollection[guildId].queue.dequeue(), guildId)
                }
                else if(newStatus.status === 'idle' && oldStatus.status !== 'idle'){
                    this.emit('queueEnd', this.StreamConnectionCollection[guildId].textChannel)
                    this.destroyConnection(guildId) 
                }
            })
        }
    }
}

module.exports = Player