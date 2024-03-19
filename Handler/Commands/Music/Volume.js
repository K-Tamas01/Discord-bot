module.exports = {
	name:'volume',
	category:'Service',
	description:'$volume (value)',
	isload: true,
	run: async (bot, msg, args) => {
		bot.player.setVoiceVolume(msg.guild.id, args)
    }
}