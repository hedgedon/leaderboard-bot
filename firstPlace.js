require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.BOT_TOKEN;
const serverId = process.env.SERVER_ID;
client.login(token);

client.on('ready', () => {
  console.log(
    '>>> 1st Place Discord bot is Online, please wait while its fetching data <<<'
  );
  setBot();
});
client.on('rateLimit', (info) => {
  console.log(
    `Rate limit hit ${
      info.timeDifference
        ? info.timeDifference
        : info.timeout
        ? info.timeout
        : 'Unknown timeout '
    }`
  );
});

async function setBot(poolName1st, poolPerformance1st, poolTotalValue1st) {
  try {
    const guild = client.guilds.cache.get(`${serverId}`);
    // SET POOL NAME (32 char limit)
    await guild.me.setNickname(`1. ${poolName1st}`);

    // SET POOLS TOKEN VALUE AS PLAYING
    await client.user.setActivity(
      `🏆 +${poolPerformance1st}% | ${poolTotalValue1st}`,
      {
        type: 'PLAYING',
      }
    );
    console.log('executed setBot() to set the name & activity!');
  } catch (error) {
    console.log('Your Error: ', error);
  }
}
exports.setBot = setBot;
