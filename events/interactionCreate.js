const { Events } = require('discord.js');
const colors = require('../colors');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`${colors.FgGray}[${colors.FgYellow}WARNING${colors.FgGray}]${colors.Reset} No command matching ${interaction.commandName} was found.`);
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
	},
};
