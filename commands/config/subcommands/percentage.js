const { MongoClient } = require('mongodb');
require('dotenv').config();

module.exports.execute = async (interaction) => {
	const percentage = interaction.options.getInteger('percentage');
	const guildId = interaction.guildId;
	const uri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017';
	const client = new MongoClient(uri);

	try {
		const database = client.db('antitoxicity');
		const config = database.collection('config');
		const data = { _id: guildId, percentage: percentage };

		await config.updateOne({ _id: data._id }, { $set: data }, { upsert: true });
	} catch (e) {
		console.error(e);
		return await interaction.editReply('Something went wrong. If this message persists, contact the bot\'s owner');
	} finally {
		await client.close();
	}

	await interaction.editReply(`Updated the percentage required for a message deletion to ${percentage}%`);
};