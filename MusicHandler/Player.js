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
        this.nowPlaying = {}
        this.options = {
            seek: 0,
            quality: 2,
            format: 'mp3',
            discordPlayerCompatibility: true,
        }
        play_yt.setToken({
            youtube: {
                cookie: "HSID=AlfPiJNdREX6zShRd; SSID=AStBcrd7v-lPYUJob; APISID=lLKK7OGgyrsegDId/As9ahh4BIgVa0KLaC; SAPISID=B4y5P7DC3Sud0EbY/AeMsHz_s9RbQS6K9B; __Secure-1PAPISID=B4y5P7DC3Sud0EbY/AeMsHz_s9RbQS6K9B; __Secure-3PAPISID=B4y5P7DC3Sud0EbY/AeMsHz_s9RbQS6K9B; LOGIN_INFO=AFmmF2swRAIgZIxJm3kuz_ZS39qQVbz5dMwUQQXnNkHDVbmNiBvwOb0CIDc-dSZ0y84DGMXCaJjQkH1MepyFP8k0k_fOFwykAI_9:QUQ3MjNmeF92NzVBVEZIcE9nUFdhbHdjRDQyV2xlZWx6TS1Fak1nOXJkX1lQVUtDc05vRm5nQW42TklBVUk5QVpBQmRTXzNGREg4aXlmMnY4MGQwYTl4dGhXVjRiMHc0LXI1R2J1dWJzcXpseXVWNUVKZzl1SEhsWndwUWpqZW9mcWxaWHkweEhQVWs0M2d0bnlZYmFKLWJkWlRVeDk5bFBn; PREF=tz=Europe.Budapest&f7=100; VISITOR_PRIVACY_METADATA=CgJIVRIcEhgSFhMLFBUWFwwYGRobHB0eHw4PIBAREiEgXw%3D%3D; SID=g.a000mAhCMlC2Co5J31QV0AAmBDwXf2vsHgJQqStfFzHLAqg_wFIi3VeePxy7lOiiMBrZPk1tJgACgYKAUwSARcSFQHGX2MiDm0LNEoyDLC-NH8mM4QaihoVAUF8yKonVZZ5YI0G34w_WytXf-7J0076; __Secure-1PSID=g.a000mAhCMlC2Co5J31QV0AAmBDwXf2vsHgJQqStfFzHLAqg_wFIijYsTSTXh8T5UfI-rA4oeGQACgYKAXsSARcSFQHGX2MinF3FmyJTcRcdHnQM5wF0MRoVAUF8yKrwHYfAyQ61zyTeloKRuKoH0076; __Secure-3PSID=g.a000mAhCMlC2Co5J31QV0AAmBDwXf2vsHgJQqStfFzHLAqg_wFIi1JcYFOQFkp5nLSfh4QKjqwACgYKATASARcSFQHGX2MipL7y1A043xwWNbPTrFooUxoVAUF8yKpcB-90NNQRv46buox6oFE10076; YSC=4D3ysuEugXk; __Secure-1PSIDTS=sidts-CjEB4E2dkbCBkztX4-2GU2TycwP8LZuayaixr8Zv78X6oYA_WVdbuuJQ2WsKN0b_NCyMEAA; __Secure-3PSIDTS=sidts-CjEB4E2dkbCBkztX4-2GU2TycwP8LZuayaixr8Zv78X6oYA_WVdbuuJQ2WsKN0b_NCyMEAA; CONSISTENCY=AKreu9ubHJnve8-FwCnXomWpOJ6Va3C7eeyR5Fo0UNtWG9qHquKFwGupB0eWvZSfGL5Bj-aeTrRJe0Ejy0I7saPki_Z9mt7VLW62AesU0LWBj5oE9h8MpSiGvWfK55Civ-IFxP-DTuL7knzLt5vZTTYH; __Secure-YEC=CgtHTEVfV3R6RmhZbyi7hv20BjIiCgJIVRIcEhgSFhMLFBUWFwwYGRobHB0eHw4PIBAREiEgXw%3D%3D; SIDCC=AKEyXzWMOvfFETf12euVV29k5cWYFIl6MddT2QHmMLgf7qgKbgrl9YRmcbc6y-i-OSp4CffkKw; __Secure-1PSIDCC=AKEyXzUioce13aWc-5t1f59XwxOlt1lYemCivJz5P3CLXJWBv4x_5x__sHhtsEZ_Mi2T_FAIFec; __Secure-3PSIDCC=AKEyXzUDZ3pOwQPiO4MFsqH6BVHVV7DFjKmqu9anaa-ZxmvJ_jcKniQhBS1ks3HvXxJ3ruiY14U"
            }
        })
        this.getAudioAndPlay = async function(songInfo, guildId){
            if(songInfo !== undefined){
                const stream = await play_yt.stream(songInfo.url, this.options).catch((e) =>{ throw Error("Hiba történt a zene szám letöltésekor. \n Hiba: " + e)})
                const resource = createAudioResource(stream.stream, {
                    inlineVolume: true,
                    inputType: stream.type,
                })
                this.StreamConnectionCollection[guildId].resource = resource
                this.StreamConnectionCollection[guildId].player.play(this.StreamConnectionCollection[guildId].resource)
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
            textChannel: textChannel,
            queueLoop: false,
            songLoop: false,
            resource: undefined
        }
        this.StreamConnectionCollection[guildId].subscribe = this.StreamConnectionCollection[guildId].connection.subscribe(this.StreamConnectionCollection[guildId].player)
        this.StreamConnectionCollection[guildId].player.on('stateChange', async (oldStatus, newStatus) => {
            if(newStatus.status === 'idle' && (this.StreamConnectionCollection[guildId].songLoop || !this.StreamConnectionCollection[guildId].queue.isEmpty())){
                if(this.StreamConnectionCollection[guildId].songLoop){
                    setTimeout(function() {
                        this.getAudioAndPlay(this.nowPlaying[guildId], guildId)
                    }.bind(this), 1000)
                }
                else {
                    this.emit('songChanged', this.StreamConnectionCollection[guildId].textChannel, this.nowPlaying[guildId], this.StreamConnectionCollection[guildId].queue.peek())
                    if(this.StreamConnectionCollection[guildId].queueLoop) {
                        this.StreamConnectionCollection[guildId].queue.enqueue(this.nowPlaying[guildId])
                    }
                    this.nowPlaying[guildId] = this.StreamConnectionCollection[guildId].queue.dequeue()
                    setTimeout(function() {
                        this.getAudioAndPlay(this.nowPlaying[guildId], guildId)
                    }.bind(this), 1000)
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

    remove(guildId, index){
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