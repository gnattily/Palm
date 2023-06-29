const out = require('../../../out');

module.exports.execute = async (interaction) => {
	// oh no now i actually have to do something
	// aw well, ill do something tomorrow. for now,
	// ill just print something like "hello world"
	// and say "hi" to the user. oh boy

	await interaction.editReply('I can\'t actually do anything yet, but this is still exciting!');
	out.info('Percentage command ran. Oh boy');
};