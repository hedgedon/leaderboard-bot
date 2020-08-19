require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const token = process.env.TEST_BOT_TOKEN;
const serverId = process.env.DEV_SERVER_ID;
client.login(token); 

client.on("ready", () => {
  console.log("Discord bot is Online, please wait while fetching data");
  getData();
});
client.on('rateLimit', (info) => {
  console.log(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
});

const getData = (poolName1st, poolPrice1st) => {
  const guild = client.guilds.cache.get(`${serverId}`);
  // SET POOL NAME
  guild.me.setNickname(`1. ${poolName1st} 🏆`);

  // SET POOLS TOKEN VALUE AS PLAYING
  client.user.setActivity(`$${poolPrice1st}`, {
    type: "PLAYING",
  });
};
exports.getData = getData;
