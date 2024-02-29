module.exports = {
	name:'pause',
	category:'Service',
	description:'$pause',
	isload: true,
	run: async (bot, msg) => {
		bot.player.pause(msg.guild.id)
    }
}