const { Events } = require('discord.js');
const out = require('../modules/out');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		out.info(`Logged in as ${out.colors.Underscore}${client.user.tag}${out.colors.Reset}`);
	},
};
