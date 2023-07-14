const { Events, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
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
			if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ ephemeral: true, content: 'Insufficient permissions' });
			if (interaction.customId === 'deleteMessage') deleteMessage(interaction);
		}
	},
};

async function deleteMessage(interaction) {
	const uri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017';
	const client = new MongoClient(uri);
	const database = client.db('antitoxicity');
	const config = database.collection('config');

	let channelId;
	let messageId;

	try {
		await client.connect();
		const data = { _id: interaction.guildId };
		const guildConfig = await config.findOne({ _id: data._id });

		if (guildConfig && guildConfig.messages && guildConfig.messages[interaction.message.id]) channelId = guildConfig.messages[interaction.message.id].channelId;
		if (guildConfig && guildConfig.messages && guildConfig.messages[interaction.message.id]) messageId = guildConfig.messages[interaction.message.id].messageId;
	} catch (e) {
		console.error(e);
		return await interaction.reply('Something went wrong. If this message persists, contact the bot\'s owner');
	}

	const deleteMessageButton = new ButtonBuilder()
		.setCustomId('deleteMessage')
		.setLabel('Delete Message')
		.setDisabled(true)
		.setStyle(ButtonStyle.Danger);

	const jumpToMessageButton = new ButtonBuilder()
		.setLabel('Jump to Message')
		.setURL(interaction.message.url)
		.setDisabled(true)
		.setStyle(ButtonStyle.Link);

	const row = new ActionRowBuilder()
		.addComponents(deleteMessageButton, jumpToMessageButton);

	if (!channelId || !messageId) {
		const embed = interaction.message.embeds[0];
		if (embed) {
			embed.data.title = 'Message not found';
			embed.data.description += ' but could not be deleted. The message\'s database entry could not be found';
			embed.data.color = 0x2C2D31;
		}

		// this takes advantage of the fact that changing embed.foo mutates interaction.message.embeds[0].foo
		await interaction.update({ embeds: interaction.message.embeds, components: [row] });
		return;
	}

	try {
		const channel = await interaction.client.channels.fetch(channelId);
		const message = await channel.messages.fetch(messageId);
		if (await message.delete()) {
			await config.updateOne({ _id: interaction.guildId }, { $unset: { [`messages.${interaction.message.id}`]: 1 } });
		}

		const embed = interaction.message.embeds[0];
		if (embed) {
			embed.data.title = 'Message deleted';
			embed.data.color = 0x2C2D31;
		}
		await interaction.update({ embeds: interaction.message.embeds, components: [row] });
	} catch (error) {
		if (error.code !== 10008) console.error(error);
		await config.updateOne({ _id: interaction.guildId }, { $unset: { [`messages.${interaction.message.id}`]: 1 } });

		const embed = interaction.message.embeds[0];
		if (embed) {
			embed.data.title = 'Message could not be deleted';
			embed.data.description += ' but could not be deleted. Either the message is already deleted, the bot is lacking permissions, or something else went wrong.';
			embed.data.color = 0x2C2D31;
		}
		await interaction.update({ embeds: interaction.message.embeds, components: [row] });
	} finally {
		client.close();
	}
}