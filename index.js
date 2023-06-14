// const perspective = require('./perspective');

// (async function() {
// 	console.log(await perspective.getScores('im going to kill you!', ['TOXICITY', 'PROFANITY']));
// })();

require('dotenv').config();
const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, () => {
	console.log('Logged in');
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);