module.exports = {
	name:'clear',
	category:'Service',
	description:'$clear',
	isload: true,
	run: async (bot, msg) => {
		bot.player.destroyQueue(msg.guild.id)
	}
}