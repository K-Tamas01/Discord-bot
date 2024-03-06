module.exports = {
	name:'q-loop',
	category:'Service',
	description:'$q-loop',
	isload: true,
	run: async (bot, msg) => {
		bot.player.queueLoop(msg.guild.id)
    }
}