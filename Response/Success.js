const { EmbedBuilder } = require('discord.js');

module.exports = {
	run: (msg, code, queue, args, user) => {
		switch (code) {
		case 0:{
			const content = new EmbedBuilder()
				.setTitle(`Most játszom éppen: ${queue.items[0].title}`)
				.setColor('#FF1493')
				.setFooter({ text:`Requested by ${user}` })
				.setTimestamp();

			msg.channel.send({ embeds: [content] });
			break;
		}
		case 1:{

			let min_part = 0;
			const piece = parseInt(queue.items.length / 25);
			let max_part, iteration = 0;
			if (piece === 0) {
				max_part = queue.items.length;
			}
			else {
				max_part = parseInt(queue.items.length / piece);
			}

			do {
				let content;
				if (user === undefined) {
					content = new EmbedBuilder()
						.setTitle('Lejátszási listám:')
						.setColor('#FF1493')
						.setFooter({ text:`Requested by ${user}` })
						.setTimestamp();

					for (let i = min_part; i < max_part; i++) {
						content.addFields({ name: queue.items[i].title, value: ' [' + queue.items[i].duration + ']', inline: false });
					}
				}
				else {
					content = new EmbedBuilder()
						.setTitle('Lejátszási listám:')
						.setColor('#FF1493')
						.setFooter({ text:`Requested by ${user}` })
						.setTimestamp();

					for (let i = min_part; i < max_part; i++) {
						content.addFields({ name: queue.items[i].title, value: ' [' + queue.items[i].duration + ']', inline: false });
					}
				}
				msg.channel.send({ embeds: [content] });

				min_part = max_part;
				if ((max_part + max_part) >= queue.length) {
					max_part = queue.length;
				}
				else {
					max_part += max_part;
					iteration++;
				}
			}
			while (iteration < piece);
			break;
		}
		case 2:{
			const content = new EmbedBuilder()
				.setTitle(`Az alábbi szám sikeresen törölve a listáról: ${queue.items[args].title}`)
				.setColor('#FF1493')
				.setFooter({ text:`Requested by ${user}` })
				.setTimestamp();

			msg.channel.send({ embeds: [content] });
			break;
		}
		}
	},
};