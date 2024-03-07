module.exports = {
	name:'s-loop',
	category:'Service',
	description:'$s-loop',
	isload: true,
	run: async (bot, msg) => {
		bot.player.songLoop(msg.guild.id)
    }
}