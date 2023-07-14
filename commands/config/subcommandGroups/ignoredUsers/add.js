const { MongoClient } = require('mongodb');
require('dotenv').config();

module.exports = async (interaction) => {
	const user = interaction.options.getUser('user');
	const guildId = interaction.guildId;
	const uri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017';
	const client = new MongoClient(uri);

	try {
		await client.connect();
		const database = client.db('antitoxicity');
		const config = database.collection('config');

		await config.updateOne({ _id: guildId }, { $push: { ignoredUsers: user.id } }, { upsert: true });
	} catch (e) {
		console.error(e);
		return await interaction.editReply('Something went wrong. If this message persists, contact the bot\'s owner');
	} finally {
		await client.close();
	}

	await interaction.editReply(`Added ${user} as an ignored user`);
};