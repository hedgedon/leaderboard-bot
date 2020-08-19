require("dotenv").config();
  const Discord = require("discord.js");
  const client = new Discord.Client();
  const token = process.env.TEST_BOT_TOKEN;
  const serverId = process.env.DEV_SERVER_ID;
client.login(token); 

client.on("ready", () => {
  console.log(">>> Discord bot is Online, please wait while its fetching data <<<");
  setBot();
});
client.on('rateLimit', (info) => {
  console.log(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
});

const setBot = (poolName4th, poolPrice4th) => {
  const guild = client.guilds.cache.get(`${serverId}`);
  // SET POOL NAME
  guild.me.setNickname(`4. ${poolName4th} 🏆`);

  // SET POOLS TOKEN VALUE AS PLAYING
  client.user.setActivity(`$${poolPrice4th}`, {
    type: "PLAYING",
  });
  console.log("executed setBot() to set the name & activity!")
};
exports.setBot = setBot;
