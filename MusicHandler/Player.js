const EventEmitter = require('events')
const Queue = require('./Manager/Queue')
const StreamConnection = require('./Utils/StreamConnection')
const Song = require('./Manager/Song')
const Playlist = require('./Manager/Playlist')
const { createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice')
const play_yt = require('play-dl')

class Player extends EventEmitter{
    constructor(){
        super()
        this.StreamConnectionCollection = {}
        this.StreamConnection = new StreamConnection()
        this.Song = new Song()
        this.Playlist = new Playlist()
        this.nowPlaying = {}
        this.options = {
            quality: 2,
            format: 'mp3',
        }
        this.getAudioAndPlay = async function(songInfo, guildId){
            if(songInfo !== undefined){
                const stream = await play_yt.stream(songInfo.url, this.options).catch((e) =>{ throw Error("Hiba történt a zene szám letöltésekor. \n Hiba: " + e)})
                const resource = createAudioResource(stream.stream, {
                    inlineVolume: true,
                    inputType: StreamType.Opus,
                })
                this.StreamConnectionCollection[guildId].resource = resource
                this.StreamConnectionCollection[guildId].player.play(resource)
            } else {
                throw Error('Hibás link vagy argumentum.')
            }
        }
    }

    createConnection(guildId, result, textChannel){
        this.StreamConnectionCollection[guildId] = {
            connection: this.StreamConnection.join({channelid: result.id, guildId: guildId, voiceAdapterCreator: result.guild.voiceAdapterCreator}),
            player: new createAudioPlayer(),
            subscribe: undefined,
            queue: new Queue(),
            status: undefined,
            textChannel: textChannel,
            queueLoop: false,
            songLoop: false,
            resource: undefined
        }
        this.StreamConnectionCollection[guildId].subscribe = this.StreamConnectionCollection[guildId].connection.subscribe(this.StreamConnectionCollection[guildId].player)
        this.StreamConnectionCollection[guildId].status = this.StreamConnectionCollection[guildId].player.on('stateChange', async (oldStatus, newStatus) => {
            if(newStatus.status === 'idle' && (this.StreamConnectionCollection[guildId].songLoop || !this.StreamConnectionCollection[guildId].queue.isEmpty())){
                if(this.StreamConnectionCollection[guildId].songLoop){
                    this.getAudioAndPlay(this.nowPlaying[guildId], guildId)
                }
                else {
                    this.emit('songChanged', this.StreamConnectionCollection[guildId].textChannel, this.nowPlaying[guildId], this.StreamConnectionCollection[guildId].queue.peek())
                    if(this.StreamConnectionCollection[guildId].queueLoop) {
                        this.StreamConnectionCollection[guildId].queue.enqueue(this.nowPlaying[guildId])
                    }
                    this.nowPlaying[guildId] = this.StreamConnectionCollection[guildId].queue.dequeue()
                    this.getAudioAndPlay(this.nowPlaying[guildId], guildId)
                }
            }
            else if(newStatus.status === 'idle' && oldStatus.status !== 'idle'){
                this.emit('queueEnd', this.StreamConnectionCollection[guildId].textChannel)
                this.destroyConnection(guildId)
                delete this.nowPlaying[guildId]
            }
        })
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
        delete this.nowPlaying[guildId]
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

    shuffle(guildId){
        this.StreamConnectionCollection[guildId].queue.shuffle()
    }

    queueLoop(guildId){
        this.StreamConnectionCollection[guildId].queueLoop ? this.StreamConnectionCollection[guildId].queueLoop = false : this.StreamConnectionCollection[guildId].queueLoop = true
    }

    songLoop(guildId){
        this.StreamConnectionCollection[guildId].songLoop ? this.StreamConnectionCollection[guildId].songLoop = false : this.StreamConnectionCollection[guildId].songLoop = true
    }

    setVoiceVolume(guildId, value){
        this.StreamConnection.setVolume(this.StreamConnectionCollection[guildId].resource, value)
    }

    getVoiceVolume(guildId){
        return (this.StreamConnectionCollection[guildId].resource.volume.volume * 100)
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
            this.nowPlaying[guildId] = this.StreamConnectionCollection[guildId].queue.dequeue()
            this.getAudioAndPlay(this.nowPlaying[guildId], guildId)
            this.emit('firstSong', this.StreamConnectionCollection[guildId].textChannel, this.nowPlaying[guildId])
        }
    }

    async playList(content, guildId){
        const playListInfo = await this.Playlist.play(content)
        for(let track of playListInfo.videos){
            this.StreamConnectionCollection[guildId].queue.enqueue(track)
        }
        if(this.StreamConnectionCollection[guildId].player.state.status === 'idle') {
            this.nowPlaying[guildId] = playListInfo.videos[0]
            this.getAudioAndPlay(this.nowPlaying[guildId], guildId)
            this.emit('firstSong', this.StreamConnectionCollection[guildId].textChannel, this.nowPlaying[guildId])
        }
    }
}

module.exports = Player