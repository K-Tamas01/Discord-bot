const GuildQueue = require('./Manager/Queue')

class Player{
    constructor(){
        this.guildQueue = new GuildQueue()
    }
}

module.exports = Player