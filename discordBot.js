require("dotenv").config();
const cron = require("node-cron");
const timestamp = require("time-stamp");

// Discord.js Config
const Discord = require("discord.js");
const client = new Discord.Client();
const token = process.env.BOT_TOKEN;
const serverId = process.env.DEV_SERVER_ID;

// cron.schedule("*/5 * * * * *", () => {
//   console.log("SETTING DISCORD BOT NAME AND ACTIVITY EVERY 5 second");
//   console.log(timestamp.utc("YYYY/MM/DD:mm:ss"));
// });

// can i just import this and call it 3 times, passing in 3 different BOT SECRET KEYS?

async function fetchIt() {
  const guild = client.guilds.cache.get(`${serverId}`);
  // console.log(guild);

  // SET POOL NAME
  guild.me.setNickname(`POOL NAME`);

  // SET POOLS TOKEN VALUE AS PLAYING
  client.user.setActivity(`$2.32`, {
    type: "PLAYING",
  });
}

// ** INVOKE DISCORD BOT **
client.on("ready", () => {
  console.log("Discord bot is Online, please wait while fetching data");
  fetchIt();
});

client.login(token);
