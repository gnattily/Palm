## Palm  
  
An anti-toxicity discord bot to ease moderation.  

### About Palm  
  
Palm uses the [Perspective API](https://perspectiveapi.com) to analyze messages and determine how likely they are to cause someone to leave a conversation. You can configure the bot to take action on unwanted messages, such as warning moderators (`/config warn_mods`) or automatically deleting messages[\*]([https://developers.perspectiveapi.com/s/about-the-api-model-cards?tabset-20254=2](https://developers.perspectiveapi.com/s/about-the-api-model-cards?tabset-20254=2)) (`/config autodelete`).  

### FAQ  
  
#### Why is Palm not doing anything?  
Ensure you have an action enabled, such as warning moderators or autodeleting messages (read About).  
  
#### Why is Palm not sending warning messages?  
Ensure Palm is permitted to send messages in the provided channel. You may have accidentally removed its permissions.  
  
#### Why do some attributes say `(experimental)` or `(NYT)` next to them?  
Perspective has a list of [attributes that can be analyzed](https://developers.perspectiveapi.com/s/about-the-api-attributes-and-languages?language=en_US). Some are considered production attributes, meaning that they have been fully tested to provide accurate results. Some are marked as experimental, such as `SEXUALLY_EXPLICIT` and `FLIRTATION`. These attributes have not been tested as thoroughly, but should still work in most cases. Finally, some are marked as being for the New York Times (NYT). Since these attributes were made for the New York Times, they have only been trained on their data.  
  
#### Why are only some attributes available for use with Palm?  
To make Palm easier to use, we removed some attributes that were either redundant or not applicable to Discord messages.  
  
#### Does Palm record my voice calls?  
No. Palm cannot join nor listen to voice channels, nor can it scan the contents of images. For things like this, you're stuck with manual moderation.  
  
#### Does Palm store my data?  
Yes, but only things required to run the bot. Things such as message ids, channel ids, and configuration are all stored in Palm's database. Palm __does not__ store any analytics, member names, nor the content of messages. Palm will never give third-party access to _any_ of your information, even basic info. If you're still concerned, consider [[#Self Hosting|self hosting Palm]]. That being said, the content of your messages is send to Perspective's API for analysis. Although Palm adds a "do-not-store" flag with your message, we cannot guarantee that Perspective will not store your messages.
  
### Self Hosting  
  
1. Install the latest version of [node.js](https://nodejs.org)  
2. Install the [MongoDB Community Server](https://www.mongodb.com/try/download/community) and ensure it's added to `PATH`
3. Rename `.env_template` to `.env`, or duplicate the file and name it `.env`
4. Create a discord bot account ([help](https://discord.com/developers/docs/getting-started#step-1-creating-an-app))
5. Copy your bot's token (under the Bot tab) and client id (under the OAuth2 tab) into the `.env` file
6. Enable the message content intent in the Bot tab
7. Apply for a Perspective API token ([further instructions](https://developers.perspectiveapi.com/s/docs-get-started))
8. Enable the API, create an API key, and copy it into the `.env` file ([further instructions](https://developers.perspectiveapi.com/s/docs-enable-the-api))
9. Set the Mongo URI to the default `mongodb://127.0.0.1:27017` or a custom URI (if you set up one)
10. Before running the bot for the first time, run `npm run update`
11. To run the bot, open two terminals in your bot's directory. Run `mongod --dbpath ./db` in one and `npm run start` in the other ^eb632f
12. Return to your bot's page on the [Discord Developer Portal](https://discord.com/developers/applications) and navigate to the URL Generator in the OAuth2 tab
13. Select the `bot` and `applications.commands` scopes, then select the following bot permissions:
	1. Read Messages/View Channels
	3. Send Messages
	4. Send Messages in Threads
	5. Manage Messages
14. Copy the generated URL into your browser and invite the bot to your Discord server
15. You now have your own self-hosted bot. To run it in the future, repeat [[#^eb632f|step 11]]
  
### Further Questions  
  
For any questions regarding something about Perspective, visit [their website](https://perspectiveapi.com).  
For questions about the bot itself, ask in the [official Palm discord server](https://discord.gg/C8dXbvU92z). For any bugs/feature requests, create an issue.
