const { Events } = require('discord.js');
const perspective = require('../perspective');

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
		const attributes = ['TOXICITY', 'SEXUALLY_EXPLICIT', 'INSULT'];

		const scores = await perspective.getScores(message.content, attributes);

		let highest = 0;
		for (const attribute of attributes) {
			if (scores[attribute] > highest) highest = scores[attribute];
		}

		if (highest > 0.70) message.delete();
	},
};
