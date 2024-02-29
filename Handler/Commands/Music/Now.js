const suc = require('../../../Response/Success')

module.exports = {
	name:'now',
	category:'Service',
	description:'$now',
	isload: true,
	run: async (bot, msg) => {
		const data = await bot.player.getQueue(msg.guild.id)
		suc.run(msg, 0, data, undefined, msg.author.username)
    }
}