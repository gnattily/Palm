const { Events } = require('discord.js');
const { MongoClient } = require('mongodb');
const perspective = require('../perspective');

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
		if (message.author.bot) return;

		const uri = 'mongodb://127.0.0.1:27017'; // make sure you host mongodb on the default port (27017)
		const client = new MongoClient(uri);

		let percentage = 0.7;

		try {
			const database = client.db('antitoxicity');
			const config = database.collection('config');

			const guildConfig = await config.findOne({ _id: message.guild.id });

			// make sure that if the guild does not have a percentage defined the value is not set
			// and it remains as 0.7 -- also, convert it to a decimal (0 to 1)
			if (guildConfig.percentage) percentage = guildConfig.percentage / 100;
		} finally {
			await client.close();
		}

		const attributes = ['TOXICITY', 'SEXUALLY_EXPLICIT', 'INSULT'];
		const scores = await perspective.getScores(message.content, attributes);

		let highest = 0;
		for (const attribute of attributes) {
			if (scores[attribute] > highest) highest = scores[attribute];
		}

		if (highest >= percentage) message.delete();
	},
};
