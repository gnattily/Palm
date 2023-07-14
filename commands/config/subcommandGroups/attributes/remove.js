const { MongoClient } = require('mongodb');
require('dotenv').config();

module.exports = async (interaction) => {
	const attribute = interaction.options.getString('attribute');
	const guildId = interaction.guildId;
	const uri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017';
	const client = new MongoClient(uri);
	let result;

	try {
		await client.connect();
		const database = client.db('antitoxicity');
		const config = database.collection('config');

		result = await config.updateOne({ _id: guildId }, { $pull: { attributes: attribute } });
	} catch (e) {
		console.error(e);
		return await interaction.editReply('Something went wrong. If this message persists, contact the bot\'s owner');
	} finally {
		await client.close();
	}

	if (result.modifiedCount === 0) await interaction.editReply(`Could not find an attribute named \`${attribute}\` to delete`);
	else await interaction.editReply(`Removed testing for the \`${attribute}\` attribute`);
};