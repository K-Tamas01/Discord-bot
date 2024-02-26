const { isplaylist } = require("../../../Root_Service/Root_Service")

module.exports = {
	name:'play',
	category:'Service',
	description:'$play url/cím',
	isload: true,
	run: async (bot, msg, args) => {
		if(args.length !== 0){
			if(msg.member.voice.channel !== null){
				if(msg.guild.members.me.voice.channel === null || msg.guild.members.me.voice.channel.id === msg.member.voice.channel.id) {
					if(isplaylist(args)){
						bot.player.join(msg)
						bot.player.play(args[0], msg.guild.id)
					}
					else {
						bot.player.join(msg)
						bot.player.playList(args[0], msg.guild.id)
					}
				}
			}
		}
    }
}