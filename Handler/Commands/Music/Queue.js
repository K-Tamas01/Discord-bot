const suc = require('../../../Response/Success')

module.exports = {
	name:'queue',
	category:'Service',
	description:'$queue',
	isload: true,
	run: async (bot, msg) => {
		if(msg.member.voice.channel !== null){
			const data = await bot.player.getQueue(msg.guild.id)
			suc.run(msg, 1, data, undefined, msg.author.username)
		}
    }
}