const suc = require('../../../Response/Success')

module.exports = {
	name:'remove',
	category:'Service',
	description:'$remove (order)',
	isload: true,
	run: async (bot, msg, args) => {
		const data = await bot.player.remove(msg.guild.id, args)
		suc.run(msg, 2, data, args, msg.author.username)
    }
}