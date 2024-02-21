const Discord = require('discord.js');
const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play_yt = require('play-dl')
const StreamConnection = require('./MusicHandler/Utils/StreamConnection');
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
const streamConnection = new StreamConnection()
const voiceConnection = {}
const options = {
	quality: 2,
	format: 'mp3',
}

bot.on('messageCreate', async (msg) => {
	// const player = createAudioPlayer();
	// const stream = await play_yt.stream(msg.content, options)
	// const resource = createAudioResource(stream.stream, {
	// 	inlineVolume: true,
	// 	inputType: stream.type
	// })

	bot.player.join(msg)
	bot.player.play(msg.content, msg.guild.id)	
	
	// await voiceConnection[msg.member.guild.id].player.play(resource)
	// voiceConnection[msg.member.guild.id].player.on(AudioPlayerStatus.Idle, () => {
	// 	streamConnection.leave(voiceConnection[msg.member.guild.id].connection)
	// 	voiceConnection[msg.member.guild.id].player.stop()
	// 	delete voiceConnection[msg.member.guild.id]
	// })
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