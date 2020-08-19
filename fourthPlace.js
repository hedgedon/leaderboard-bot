require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const token = process.env.TEST_BOT_TOKEN;
const serverId = process.env.DEV_SERVER_ID;
client.login(token);

client.on("ready", () => {
  console.log(
    ">>> 4th Place Discord bot is Online, please wait while its fetching data <<<"
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

async function setBot(poolName4th, poolPrice4th) {
  try {
    const guild = client.guilds.cache.get(`${serverId}`);
    // SET POOL NAME
    await guild.me.setNickname(`4. ${poolName4th} `);

    // SET POOLS TOKEN VALUE AS PLAYING
    await client.user.setActivity(`$${poolPrice4th}`, {
      type: "PLAYING",
    });
    console.log("executed setBot() to set the name & activity!");
  } catch (error) {
    console.log("Your Error: ", error);
  }
}
exports.setBot = setBot;
