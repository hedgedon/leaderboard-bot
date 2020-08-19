require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const token = process.env.TEST2_BOT_TOKEN;
const serverId = process.env.DEV_SERVER_ID;
client.login(token);

client.on("ready", () => {
  console.log(
    ">>> 5th Place Discord bot is Online, please wait while its fetching data <<<"
  );
  setBot();
});
client.on("rateLimit", (info) => {
  console.log(
    `Rate limit hit ${
      info.timeDifference
        ? info.timeDifference
        : info.timeout
        ? info.timeout
        : "Unknown timeout "
    }`
  );
});

async function setBot(poolName5th, poolPrice5th) {
  try {
    const guild = client.guilds.cache.get(`${serverId}`);
    // SET POOL NAME
    await guild.me.setNickname(`5. ${poolName5th}`);

    // SET POOLS TOKEN VALUE AS PLAYING
    await client.user.setActivity(`$${poolPrice5th}`, {
      type: "PLAYING",
    });
    console.log("executed setBot() to set the name & activity!");
  } catch (error) {}
}
exports.setBot = setBot;
