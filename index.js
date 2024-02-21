const Discord = require('discord.js');
const Player = require('./MusicHandler/Player')
const bot = new Discord.Client({
	intents: [
		Discord.IntentsBitField.Flags.Guilds,
		Discord.IntentsBitField.Flags.GuildMembers,
		Discord.IntentsBitField.Flags.GuildMessages,
		Discord.IntentsBitField.Flags.MessageContent,
		Discord.IntentsBitField.Flags.GuildVoiceStates,
	],
});

bot.player = new Player()

bot.on('messageCreate', async (msg) => {
	bot.player.join(msg)
	bot.player.play(msg.content, msg.guild.id)	
})

bot.on('ready', () => {
	console.log('Online')

	const stat = [
		'Üzemen kivül!',
	]

	setInterval(function() {
		const status = stat[Math.floor(Math.random() * stat.length)]
		bot.user.setPresence({
			activities: [{ name: status, type: Discord.ActivityType.Watching }],
			status: 'online',
		});
	}, 5000)
})

bot.login("OTE4NTU1NTUyMzA3NjI2MDI1.GJHCM7.QxbGnQvcY2ZE-NiDcYXG7euVF-xMVbPj-7hirc")