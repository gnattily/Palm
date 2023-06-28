const { Events } = require('discord.js');
const colors = require('../colors');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`   ${colors.FgGray}[${colors.FgBlue}${colors.Bright}INFO${colors.FgGray}] Logged in as ${colors.Underscore}${client.user.tag}${colors.Reset}`);
	},
};
