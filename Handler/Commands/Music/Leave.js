module.exports = {
	name:'leave',
	category:'Service',
	description:'$leave',
	isload: true,
	run: async (bot, msg, args, guildqueue) => {
		if(msg.member.voice.channel !== null){
			if(msg.guild.members.me.voice.channel === null || msg.guild.members.me.voice.channel.id === msg.member.voice.channel.id){
				bot.player.destroyConnection(msg.guild.id)
			}
		}
    }
}