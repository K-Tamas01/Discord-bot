const Queue = require('./Manager/Queue')
const StreamConnection = require('./Utils/StreamConnection')
const Song = require('./Manager/Song')
const Playlist = require('./Manager/Playlist')
const { createAudioPlayer } = require('@discordjs/voice')

class Player{
    constructor(){
        this.StreamConnectionCollection = {}
        this.StreamConnection = new StreamConnection()
        this.Song = new Song()
        this.Playlist = new Playlist()
    }

    createConnection(guildId, result){
        this.StreamConnectionCollection[guildId] = {
            connection: this.StreamConnection.join({channelid: result.id, guildId: guildId, voiceAdapterCreator: result.guild.voiceAdapterCreator}),
            player: new createAudioPlayer(),
            subscribe: undefined,
            queue: new Queue(),
            status: undefined
        }
        this.StreamConnectionCollection[guildId].subscribe = this.StreamConnectionCollection[guildId].connection.subscribe(this.StreamConnectionCollection[guildId].player)
    }

    getConnections(guildId){
        return this.StreamConnectionCollection[guildId]
    }

    destroyConnection(guildId){
        this.StreamConnectionCollection[guildId].connection = this.StreamConnection.leave(this.StreamConnectionCollection[guildId].connection)
        delete this.StreamConnectionCollection[guildId]
    }

    join(data){
        const result = data.guild.channels.resolve(data.member.voice.channel.id)
        if(result){
            const guildId = result.guild.id
            if(!this.getConnections(guildId)){
                this.createConnection(guildId, result)
            }
        }
    }

    play(content, guildId){
        console.log(this.StreamConnectionCollection[guildId].queue)
        if(this.StreamConnectionCollection[guildId].player.state.status === 'idle') {
            this.StreamConnectionCollection[guildId].player.play(this.Song.play(content))
            this.StreamConnectionCollection[guildId].status = this.StreamConnectionCollection[guildId].player.on('stateChange', (oldStatus, newStatus) => {
                console.log(newStatus)
                if(newStatus === 'idle' && this.StreamConnectionCollection[guildId].queue.size() > 0){
                    this.StreamConnectionCollection[guildId].player.play(this.StreamConnectionCollection[guildId].queue.dequeue())
                    console.log('valami')
                }
                else if(newStatus === 'idle' && oldStatus !== 'idle'){
                    this.destroyConnection(guildId)
                    console.log('destroy')
                }
            })
        } else {
            this.StreamConnectionCollection[guildId].queue.enqueue(this.Song.play(content))
        }
    }
}

module.exports = Player