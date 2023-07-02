const out = require('../../../out');
const { MongoClient } = require('mongodb');

module.exports.execute = async (interaction) => {
	const percentage = interaction.options.getInteger('percentage');
	const guildId = interaction.guildId;
	const uri = 'mongodb://127.0.0.1:27017'; // make sure you host mongodb on the default port (27017)
	const client = new MongoClient(uri);

	try {
		const database = client.db('antitoxicity');
		const config = database.collection('config');
		const data = { _id: guildId, percentage: percentage };

		await config.updateOne({ _id: data._id }, { $set: data }, { upsert: true });

		out.info(`Updated percentage for \`${guildId}\` to ${percentage}`);
	} catch {
		await interaction.editReply('Something went wrong. If this message persists, contact the bot\'s owner');
	} finally {
		await client.close();
	}

	await interaction.editReply(`Updated the percentage required for a message deletion to ${percentage}`);
};