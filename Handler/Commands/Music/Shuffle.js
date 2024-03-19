module.exports = {
	name:'shuffle',
	category:'Service',
	description:'$shuffle',
	isload: true,
	run: async (bot, msg) => {
		bot.player.shuffle(msg.guild.id)
    }
}