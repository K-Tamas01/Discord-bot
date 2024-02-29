module.exports = {
	name:'continue',
	category:'Service',
	description:'$continue',
	isload: true,
	run: async (bot, msg) => {
		bot.player.unpause(msg.guild.id)
    }
}