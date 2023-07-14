const { Events } = require('discord.js');
const { MongoClient } = require('mongodb');
const perspective = require('../modules/perspective');
const sendWarning = require('./modules/warnMods');
require('dotenv').config();

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
		if (message.author.bot) return;

		const uri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017';
		const client = new MongoClient(uri);

		let percentage = 0.7;
		let autodelete = false;
		let warnMods = false;
		let warnChannel;
		let attributes = ['TOXICITY'];
		let ignoredChannels = [];
		let ignoredUsers = [];

		try {
			await client.connect();
			const database = client.db('antitoxicity');
			const config = database.collection('config');

			const guildConfig = await config.findOne({ _id: message.guild.id });

			// if this doesn't work, encapsulate all the if statements in "if (guildConfig) {}"
			// and it remains as 0.7 -- also, convert it to a decimal (0 to 1)
			if (guildConfig) {
				if (guildConfig.percentage) percentage = guildConfig.percentage / 100;
				if (guildConfig.autodelete) autodelete = guildConfig.autodelete;
				if (guildConfig.warnMods) warnMods = guildConfig.warnMods;
				if (guildConfig.warnChannel) warnChannel = guildConfig.warnChannel;
				if (guildConfig.attributes && guildConfig.attributes.length > 0) attributes = guildConfig.attributes;
				if (guildConfig.ignoredChannels) ignoredChannels = guildConfig.ignoredChannels;
				if (guildConfig.ignoredUsers) ignoredUsers = guildConfig.ignoredUsers;
			}
		} finally {
			await client.close();
		}

		if (autodelete || warnMods && !ignoredChannels.includes(message.channel.id) && !ignoredUsers.includes(message.author.id)) {
			const scores = await perspective.getScores(message.content, attributes);

			let highest = 0;
			for (const attribute of attributes) {
				if (scores[attribute] > highest) highest = scores[attribute];
			}

			if (warnMods && warnChannel && highest >= percentage) {
				sendWarning(message, warnChannel, attributes, scores, highest);
			}

			if (autodelete && highest >= percentage) message.delete();
		}
	},
};
