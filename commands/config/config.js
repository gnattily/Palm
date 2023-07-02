const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const out = require('../../out');

async function execute(interaction) {
	await interaction.deferReply({ ephemeral: true });
	const subcommand = interaction.options.getSubcommand();

	try {
		require(`./subcommands/${subcommand}.js`)?.execute(interaction);
	} catch (error) {
		interaction.editReply('Could not find that subcommand. If this message persists, contact the bot\'s owner');
		out.warn(`Could not find "${subcommand}.js", or the file does not contain an execute method.`);
	}
}

const data = new SlashCommandBuilder()
	.setName('config')
	.setDescription('Configure the bot to your liking')
	.addSubcommand(subcommand =>
		subcommand
			.setName('percentage')
			.setDescription('Change the percentage where the bot will delete messages')
			.addIntegerOption(option => option.setName('percentage').setDescription('The percentage').setMaxValue(100).setMinValue(1).setRequired(true)))
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

module.exports = {
	data: data,
	execute,
};