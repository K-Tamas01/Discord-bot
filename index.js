const Discord = require('discord.js');
const {prefix, token} = require('./Config/config.json')
const Player = require('./MusicHandler/Player')
const button = require('./Response/Button')
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

bot.player.on('firstSong', (guildmsg, song) => {
	button.run(guildmsg, song, undefined)
})

bot.player.on('songChanged', (guildmsg, song, newSong) => {
	button.run(guildmsg, song, newSong)
})

bot.player.on('queueEnd', (guildmsg) => {
	button.run(guildmsg, undefined, undefined)
})

bot.on('interactionCreate', async (interact) => {
	if (!interact.isButton()) return;

	if (interact.member.voice.channel === null || interact.guild.members.me.voice.channel === null || interact.member.voice.channel.id !== interact.guild.members.me.voice.channel.id) {
		interact.deferUpdate();
		return;
	}

	let cmd;
	let vol = bot.player.getVoice(interact.guild.id);
	switch (interact.customId) {
	case 'Play':{
		cmd = 'continue';
		break;
	}
	case 'volume+':{
		cmd = 'volume';
		if ((vol + 10) > 100) break;
		else vol += 10;
		break;
	}
	case 'volume-':{
		cmd = 'volume';
		if ((vol - 10) < 0) break;
		else vol -= 10;
		break;
	}
	case 'Skip':{
		cmd = 'skip';
		break;
	}
	case 'Leave':{
		cmd = 'leave';
		break;
	}
	case 'Pause':{
		cmd = 'pause';
		break;
	}
	case 'Queue':{
		cmd = 'queue';
		break;
	}
	}

	let command = bot.command.get(cmd);

	if (!command) command = bot.command.get(bot.aliases.get(cmd));

	switch (interact.customId) {
	case 'Play':{
		command.run(bot, interact);
		interact.deferUpdate();
		break;
	}
	case 'volume+':{
		command.run(bot, interact, vol);
		interact.deferUpdate();
		break;
	}
	case 'volume-':{
		command.run(bot, interact, vol);
		interact.deferUpdate();
		break;
	}
	case 'Skip':{
		command.run(bot, interact);
		interact.deferUpdate();
		break;
	}
	case 'Leave':{
		command.run(bot, interact);
		button.run(interact, undefined, undefined)
		interact.deferUpdate();
		break;
	}
	case 'Pause':{
		command.run(bot, interact);
		interact.deferUpdate();
		break;
	}
	case 'Queue':{
		command.run(bot, interact);
		interact.deferUpdate();
		break;
	}
	}
});

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

//bot.login(token)
bot.login("OTE1MTU3NDExMTg5Mzc1MDQ3.Gf8s1M.n1eKU9kOxROlu2DUUfOHtXvKCDcMv5XiqRSfrU") //Ez az éles bot tokenje NE HASZNÁLD