require("dotenv").config();
const cron = require("node-cron");
const timestamp = require("time-stamp");

const getData = (sXAU, sXAURate) => {
  // Discord.js Config
  const Discord = require("discord.js");
  const client = new Discord.Client();
  const token = process.env.SYNTH_TOKEN;
  const serverId = process.env.DEV_SERVER_ID;

  // ** INVOKE DISCORD BOT **
  client.on("ready", () => {
    console.log("Discord bot is Online, please wait while fetching data");
    const guild = client.guilds.cache.get(serverId);

    // SET BOT NAME
    guild.me.setNickname(`$${sXAURate} `);

    // SET ACTIVITY
    client.user.setActivity(`${sXAU}/sUSD`, {
      type: "PLAYING",
    });
  });

  client.login(token);
};
exports.getData = getData;
