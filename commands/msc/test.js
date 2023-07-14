const { interpolateColor } = require('../../modules/interpolateColor');
const { formatString, roundPercentage } = require('../../modules/out');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getScores } = require('../../modules/perspective');

async function execute(interaction) {
	interaction.deferReply({ ephemeral: true });

	const string = interaction.options.getString('text');
	const attribute = interaction.options.getString('attribute');

	const scores = await getScores(string, [attribute]);

	const embed = new EmbedBuilder()
		.setTitle('Results')
		.addFields(
			{
				name: 'Message',
				value: string.slice(0, 1024),
			},
			{
				name: formatString(attribute),
				value: `${roundPercentage(scores[attribute])}% likely`,
				inline: true,
			},
		)
		.setColor(
			interpolateColor(
				[0x588157, 0x9a9835, 0xfcba03, 0xf77f00, 0xd62828],
				[0, 0.4, 0.6, 0.70, 1],
				scores[attribute],
			),
		);

	await interaction.editReply({ embeds: [embed] });
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Test some text for the inputted attribute')
		.addStringOption(option =>
			option
				.setName('text')
				.setDescription('The text to test')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('attribute')
				.setDescription('The attribute to test for')
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
				)),
	execute,
};