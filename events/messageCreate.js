const { Events } = require('discord.js');
const perspective = require('../perspective');

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
		const scores = await perspective.getScores(message.content, ['TOXICITY']);

		if (scores.TOXICITY > 0.7) message.delete();
	},
};
