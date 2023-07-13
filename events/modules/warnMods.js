const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');
const { formatString } = require('../../modules/out');
const interpolateColor = require('../../modules/interpolateColor');

module.exports = async (message, channelid, attributes, scores, totalScore) => {
	try {
		await sendWarningMessage(message, channelid, attributes, scores, totalScore);
	} catch (error) {
		console.error(error);
	}
};

async function sendWarningMessage(message, channelid, attributes, scores, totalScore) {
	const deleteMessage = new ButtonBuilder()
		.setCustomId('deleteMessage')
		.setLabel('Delete Message')
		.setStyle(ButtonStyle.Danger);

	const jumpToMessage = new ButtonBuilder()
		.setLabel('Jump to Message')
		.setURL(message.url)
		.setStyle(ButtonStyle.Link);

	const row = new ActionRowBuilder()
		.addComponents(deleteMessage, jumpToMessage);

	const embed = new EmbedBuilder()
		.setTitle('Message sent')
		.setDescription(`A message sent in ${message.channel} by ${message.author} was flagged for \`${formatString(findHighestAttribute(attributes, scores))}\``)
		.addFields(
			{
				name: 'Message',
				value: message.content.slice(0, 1024),
			},
			{
				name: 'Total',
				value: `${roundPercentage(totalScore)}% likely`,
				inline: true,
			},
		);

	attributes.forEach(attribute => {
		embed.addFields({
			name: formatString(attribute),
			value: `${roundPercentage(scores[attribute])}% likely`,
			inline: true,
		});
	});

	embed.setColor(
		interpolateColor(
			[0x588157, 0x9a9835, 0xfcba03, 0xf77f00, 0xd62828],
			[0, 0.4, 0.6, 0.70, 1],
			totalScore,
		),
	);


	const channel = message.client.channels.cache.get(channelid);
	const sentMessage = await channel.send({
		content: '',
		components: [row],
		embeds: [embed],
	});

	const uri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017';
	const client = new MongoClient(uri);

	try {
		const database = client.db('antitoxicity');
		const config = database.collection('config');

		try {
			await config.updateOne({ _id: message.guildId }, { $set: { ['messages.' + sentMessage.id]: { channelId: message.channel.id, messageId: message.id } } });
		} catch {
			await config.insertOne({ _id: message.guildId, messages: { [sentMessage.id]: { channelId: message.channel.id, messageId: message.id } } }).catch((error) => {
				console.error(error);
			});
		}

	} finally {
		client.close();
	}
}

function roundPercentage(value) {
	const percentage = value * 100;
	return Math.round(percentage * 10) / 10;
}

function findHighestAttribute(attributes, scores) {
	let highest = 0;
	let highestAttribute;

	for (const attribute of attributes) {
		if (scores[attribute] > highest) {
			highest = scores[attribute];
			highestAttribute = attribute;
		}
	}

	return highestAttribute;
}