const Discord = require('discord.js');
const {prefix, token} = require('./Config/config.json')
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
const fs = require('fs');

bot.player = new Player()
bot.command = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.categ = fs.readdirSync('./Handler/Commands');
['Handler'].forEach(handler => {
	require(`./Handler/${handler}`)(bot);
});

bot.on('messageCreate', async (msg) => {
	if(msg.author.bot) return;
	if(!msg.content.startsWith(prefix)) return;

	const args = msg.content.slice(prefix.length).trim().split(/ +/g);
	let cmd = args.shift().toLowerCase();

	if (cmd === 0) cmd = 'help';

	let command = bot.command.get(cmd);

	if (!command) command = bot.command.get(bot.aliases.get(cmd));

	if (command === undefined) {
		return;
	}

	command.run(bot, msg, args);
})

bot.player.on('firstSong', () => {

})

bot.player.on('songChanged', () => {

})

bot.player.on('queueEnd', () => {

})

// bot.player.on('queueDestroy', () => {

// })

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

bot.login(token)
//bot.login("OTE1MTU3NDExMTg5Mzc1MDQ3.Gf8s1M.n1eKU9kOxROlu2DUUfOHtXvKCDcMv5XiqRSfrU") //Ez az éles bot tokenje NE HASZNÁLD