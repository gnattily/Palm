const { Events } = require('discord.js');
const { MongoClient } = require('mongodb');
const out = require('../modules/out');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {

			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				out.warn(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'There was an error while executing this command.', ephemeral: true });
				} else {
					await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
				}
			}
		} else if (interaction.isButton()) {
			if (interaction.customId === 'deleteMessage') {
				await interaction.deferReply({ ephemeral: true });

				const uri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017';
				const client = new MongoClient(uri);

				let channelId;
				let messageId;

				try {
					const database = client.db('antitoxicity');
					const config = database.collection('config');
					const data = { _id: interaction.guildId };

					const guildConfig = await config.findOne({ _id: data._id });

					if (guildConfig && guildConfig.messages && guildConfig.messages[interaction.message.id]) channelId = guildConfig.messages[interaction.message.id].channelId;
					if (guildConfig && guildConfig.messages && guildConfig.messages[interaction.message.id]) messageId = guildConfig.messages[interaction.message.id].messageId;
				} catch (e) {
					console.error(e);
					return await interaction.editReply('Something went wrong. If this message persists, contact the bot\'s owner');
				} finally {
					await client.close();
				}

				try {
					const channel = await interaction.client.channels.fetch(channelId);
					const message = await channel.messages.fetch(messageId);
					await message.delete();

					await interaction.editReply('Message deleted');
					await interaction.message.delete();
				} catch (error) {
					console.error(error);
					interaction.editReply('Could not delete this message');
				}
			}
		}
	},
};
