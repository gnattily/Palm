const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

async function execute(interaction) {
	const sent = await interaction.reply({ content: 'Getting ping...', fetchReply: true });

	const embed = new EmbedBuilder()
		.setTitle('Pong!')
		.setDescription(`Websocket ping: ${interaction.client.ws.ping}ms\nRoundtrip ping: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);

	interaction.editReply({ content: '', embeds: [embed] });
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with "Pong" and the bot\'s latency'),
	execute,
};