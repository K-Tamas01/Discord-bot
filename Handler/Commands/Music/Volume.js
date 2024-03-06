module.exports = {
	name:'volume',
	category:'Service',
	description:'$volume (value)',
	isload: true,
	run: async (bot, msg, args) => {
		bot.player.setVolume(msg.guild.id, args)
    }
}