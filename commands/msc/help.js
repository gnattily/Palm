const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

async function execute(interaction) {
	const embed = new EmbedBuilder()
		.setTitle('Palm')
		.setURL('https://discord.com/oauth2/authorize?client_id=1118376330271141948&permissions=1374389546048&scope=bot%20applications.commands')
		.setDescription('The discord bot making moderation easier.')
		.addFields(
			{
				name: 'About',
				value: 'Palm uses the [Perspective API](https://perspectiveapi.com) to analyze messages and determine how likely they are to cause someone to leave a conversation. By default, the bot does not analyze messages. You can enable this by specifying an action to take on unwanted messages, such as warning moderators (`/config warn_mods`) or automatically deleting messages[*](https://developers.perspectiveapi.com/s/about-the-api-model-cards?tabset-20254=2 \'Warning on auto-deletion (scroll to Uses to Avoid)\') (`/config autodelete`).',
			},
			{
				name: 'FAQ',
				value: 'Q: Why is Palm not doing anything?\nA: Make sure you have an action enabled, such as warning moderators or autodeleting messages (read About).\n\nQ: Why is Palm not sending warning messages?\nA: Make sure that Palm has permission to send messages in the channel provided. You may have accidentally removed its permissions.\n\nQ: Why do some attributes have `(experimental)` or `(NYT)` next to them?\nA: Perspective has a list of [attributes that can be analyzed](https://developers.perspectiveapi.com/s/about-the-api-attributes-and-languages?language=en_US). There are some that are considered production attributes, meaning that they have been fully tested to provide accurate results. Some are marked as experimental, such as `SEXUALLY_EXPLICIT` and `FLIRTATION`. These attributes have not been tested as thoroughly, but should still work in most cases. Finally, some are marked as being for the New York Times (NYT). Since these attributes were made for the New York Times, they have only been trained on their data.',
			},
			{
				name: 'FAQ Continued',
				value: 'Q: Why are only some attributes available for use with Palm?\nA: To make Palm easier to use, some attributes have been removed that were either redundant or not applicable to Discord messages.\n\nQ: Does Palm record my voice calls?\nA: No. Palm cannot join nor listen to voice channels, nor can it scan the contents of images. For things like this, you\'re stuck with manual moderation.\n\nQ: Does Palm store any of my data?\nA: Yes, but only things required to run the bot. Things such as message ids, channel ids, and configuration are all stored in Palm\'s database. Palm will never give a third party access to *any* of your information, even basic info. If you are still concerned, consider self-hosting Palm (see section below).',
			},
			{
				name: 'Self-hosting',
				value: 'If you would like, you can self-host the bot. Just view the instructions in [`README.md`](https://github.com/lGrom/antitoxicity-bot/README.md) on the [Github repo](https://github.com/lGrom/antitoxicity-bot/).',
			},
			{
				name: 'More info/help',
				value: 'For any questions regarding something about Perspective, visit [their website](https://perspectiveapi.com).\nFor questions about the bot itself, first try to use the descriptions and names of commands. If you still need help, ask in the [official Palm discord server](https://discord.gg/C8dXbvU92z)',
			},
		)
		.setColor('#747645');

	await interaction.reply({ embeds: [embed] });
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('A list of FAQs and resources'),
	execute,
};