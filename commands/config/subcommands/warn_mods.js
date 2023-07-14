const { PermissionsBitField } = require('discord.js');
const { MongoClient } = require('mongodb');
require('dotenv').config();

module.exports = async (interaction) => {
	const warnMods = interaction.options.getBoolean('warn_mods');
	let channel = interaction.options.getChannel('channel');
	const guildId = interaction.guildId;
	const uri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017';
	const client = new MongoClient(uri);

	// while this is not fool-proof (a user could give permissions, run the command, then remove them), it does provide the average user with some feedback
	if (channel && !channel.permissionsFor(interaction.client.user).has(PermissionsBitField.FLAGS.SEND_MESSAGES)) {
		return interaction.editReply('Cannot send messages in that channel. Please give the bot permission to view the channel and try again.');
	}

	try {
		await client.connect();
		const database = client.db('antitoxicity');
		const config = database.collection('config');
		const data = { _id: guildId, warnMods: warnMods };

		if (channel) data['warnChannel'] = channel.id;

		if (warnMods && !channel) {
			const guildConfig = await config.findOne({ _id: data._id });

			if (!guildConfig.warnChannel) {
				await client.close;
				await interaction.editReply('Please provide a channel');
				return;
			} else {
				channel = guildConfig.warnChannel;
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