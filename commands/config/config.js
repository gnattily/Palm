const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const out = require('../../modules/out');

// Perhaps sometime in the future this could be made to use a Collection like in index.js for commands, but this works for now and I'm not going to change it
async function execute(interaction) {
	await interaction.deferReply({ ephemeral: true });
	const subcommand = interaction.options.getSubcommand();
	const subcommandGroup = interaction.options.getSubcommandGroup();

	if (subcommandGroup) {
		try {
			require(`./subcommandGroups/${subcommandGroup}/${subcommand}.js`)(interaction);
		} catch (error) {
			interaction.editReply('Could not find that subcommand. If this message persists, contact the bot\'s owner');
			out.warn(`Could not find "./commands/config/subcommandGroups/${subcommandGroup}/${subcommand}.js`);
		}
	} else {
		try {
			require(`./subcommands/${subcommand}.js`)(interaction);
		} catch (error) {
			interaction.editReply('Could not find that subcommand. If this message persists, contact the bot\'s owner');
			out.warn(`Could not find "./commands/config/subcommands/${subcommand}.js", or the file is invalid.`);
		}
	}
}

const data = new SlashCommandBuilder()
	.setName('config')
	.setDescription('Configure the bot to your liking')
	.addSubcommand(subcommand =>
		subcommand
			.setName('percentage')
			.setDescription('Change the percentage at which messages are deemed offensive')
			.addIntegerOption(option =>
				option
					.setName('percentage')
					.setDescription('The percentage')
					.setMaxValue(100)
					.setMinValue(1)
					.setRequired(true)))
	.addSubcommand(subcommand =>
		subcommand
			.setName('autodelete')
			.setDescription('Automatically delete messages that are deemed toxic')
			.addBooleanOption(option =>
				option
					.setName('autodelete')
					.setDescription('Whether or not to automatically delete messages')
					.setRequired(true)))
	.addSubcommand(subcommand =>
		subcommand
			.setName('warn_mods')
			.setDescription('Warn moderators about potentially toxic messages')
			.addBooleanOption(option =>
				option
					.setName('warn_mods')
					.setDescription('Whether or not to warn moderators')
					.setRequired(true))
			.addChannelOption(option =>
				option
					.setName('channel')
					.setDescription('The channel to warn moderators in')
					.addChannelTypes(ChannelType.GuildText)))
	.addSubcommandGroup(group =>
		group
			.setName('attributes')
			.setDescription('Add/remove attributes to test messages for')
			.addSubcommand(subcommand =>
				subcommand
					.setName('add')
					.setDescription('Add an attribute to test for')
					.addStringOption(option =>
						option
							.setName('attribute')
							.setDescription('The attribute to add')
							.setRequired(true)
							.addChoices(
								{ name: 'Toxicity', value: 'TOXICITY' },
								{ name: 'Severe Toxicity', value: 'SEVERE_TOXICITY' },
								{ name: 'Identity Attack', value: 'IDENTITY_ATTACK' },
								{ name: 'Insult', value: 'INSULT' },
								{ name: 'Profanity', value: 'PROFANITY' },
								{ name: 'Threat', value: 'THREAT' },
								{ name: 'Sexually Explicit (experimental)', value: 'SEXUALLY_EXPLICIT' },
								{ name: 'Flirtation (experimental)', value: 'FLIRTATION' },
								{ name: 'Incoherent (NYT)', value: 'INCOHERENT' },
								{ name: 'Inflammatory (NYT)', value: 'INFLAMMATORY' },
								{ name: 'Obscene (NYT)', value: 'OBSCENE' },
								{ name: 'Spam (NYT)', value: 'SPAM' },
								{ name: 'Unsubstantial (NYT)', value: 'UNSUBSTANTIAL' },
							)))
			.addSubcommand(subcommand =>
				subcommand
					.setName('remove')
					.setDescription('Remove an attribute to test for')
					.addStringOption(option =>
						option
							.setName('attribute')
							.setDescription('The attribute to remove')
							.setRequired(true)
							.addChoices(
								{ name: 'Toxicity', value: 'TOXICITY' },
								{ name: 'Severe Toxicity', value: 'SEVERE_TOXICITY' },
								{ name: 'Identity Attack', value: 'IDENTITY_ATTACK' },
								{ name: 'Insult', value: 'INSULT' },
								{ name: 'Profanity', value: 'PROFANITY' },
								{ name: 'Threat', value: 'THREAT' },
								{ name: 'Sexually Explicit (experimental)', value: 'SEXUALLY_EXPLICIT' },
								{ name: 'Flirtation (experimental)', value: 'FLIRTATION' },
								{ name: 'Incoherent (NYT)', value: 'INCOHERENT' },
								{ name: 'Inflammatory (NYT)', value: 'INFLAMMATORY' },
								{ name: 'Obscene (NYT)', value: 'OBSCENE' },
								{ name: 'Spam (NYT)', value: 'SPAM' },
								{ name: 'Unsubstantial (NYT)', value: 'UNSUBSTANTIAL' },
							))))
	.addSubcommandGroup(group =>
		group
			.setName('ignored_channels')
			.setDescription('Add/remove channels to ignore')
			.addSubcommand(subcommand =>
				subcommand
					.setName('add')
					.setDescription('Add a channel to ignore')
					.addChannelOption(option =>
						option
							.setName('channel')
							.setDescription('The channel to add')
							.addChannelTypes(ChannelType.GuildText)
							.setRequired(true)))
			.addSubcommand(subcommand =>
				subcommand
					.setName('remove')
					.setDescription('Remove a channel to ignore')
					.addChannelOption(option =>
						option
							.setName('channel')
							.setDescription('The channel to remove')
							.addChannelTypes(ChannelType.GuildText)
							.setRequired(true))))
	.addSubcommandGroup(group =>
		group
			.setName('ignored_users')
			.setDescription('Add/remove users to ignore')
			.addSubcommand(subcommand =>
				subcommand
					.setName('add')
					.setDescription('Add a user to ignore')
					.addUserOption(option =>
						option
							.setName('user')
							.setDescription('The user to add')
							.setRequired(true)))
			.addSubcommand(subcommand =>
				subcommand
					.setName('remove')
					.setDescription('Remove a user to ignore')
					.addChannelOption(option =>
						option
							.setName('channel')
							.setDescription('The user to remove')
							.setRequired(true))))
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

module.exports = {
	data: data,
	execute,
};