const { MongoClient } = require('mongodb');
require('dotenv').config();

module.exports.execute = async (interaction) => {
	const warnMods = interaction.options.getBoolean('warn_mods');
	const channel = interaction.options.getChannel('channel');
	const guildId = interaction.guildId;
	const uri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017';
	const client = new MongoClient(uri);

	try {
		const database = client.db('antitoxicity');
		const config = database.collection('config');
		const data = { _id: guildId, warnMods: warnMods };

		if (channel) data['warnChannel'] = channel.id;

		if (warnMods && !channel) {
			const guildConfig = await config.findOne({ _id: data._id });

			if (!guildConfig.channel) {
				await client.close;
				await interaction.editReply('Please provide a channel');
				return;
			}
		}

		await config.updateOne({ _id: data._id }, { $set: data }, { upsert: true });
	} catch (e) {
		console.error(e);
		return await interaction.editReply('Something went wrong. If this message persists, contact the bot\'s owner');
	} finally {
		await client.close();
	}

	if (warnMods) await interaction.editReply(`Turned on moderator warning messages in ${channel}`);
	else if (channel) await interaction.editReply(`Turned off moderator warning messages, but set the warning channel to ${channel} for future use`);
	else await interaction.editReply('Turned off moderator warning messages');
};