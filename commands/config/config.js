const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const out = require('../../modules/out');

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
			.setDescription('Change the percentage at which messages are deemed offensive')
			.addIntegerOption(option => option.setName('percentage').setDescription('The percentage').setMaxValue(100).setMinValue(1).setRequired(true)))
	.addSubcommand(subcommand =>
		subcommand
			.setName('autodelete')
			.setDescription('Automatically delete messages that are deemed toxic')
			.addBooleanOption(option => option.setName('autodelete').setDescription('Whether or not to automatically delete messages').setRequired(true)))
	.addSubcommand(subcommand =>
		subcommand
			.setName('warn_mods')
			.setDescription('Warn moderators about potentially toxic messages')
			.addBooleanOption(option => option.setName('warn_mods').setDescription('Whether or not to warn moderators').setRequired(true))
			.addChannelOption(option => option.setName('channel').setDescription('The channel to warn moderators in').addChannelTypes(ChannelType.GuildText)))
	// .addSubcommandGroup(group =>
	// 	group
	// 		.setName(''))
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

module.exports = {
	data: data,
	execute,
};