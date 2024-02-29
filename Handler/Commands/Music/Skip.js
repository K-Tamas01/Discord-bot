module.exports = {
	name:'skip',
	category:'Service',
	description:'$skip',
	isload: true,
	run: async (bot, msg) => {
		await bot.player.skip(msg.guild.id)
    }
}