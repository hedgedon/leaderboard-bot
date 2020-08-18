require("dotenv").config();

const getData = (poolName3rd, poolPrice3rd) => {
  // DISCORD CONFIG
  // Discord.js Config
  const Discord = require("discord.js");
  const client = new Discord.Client();
  const token = process.env.BOT3_TOKEN;
  const serverId = process.env.DEV_SERVER_ID;

  console.log(poolName3rd, poolPrice3rd);

  async function setBot() {
    const guild = client.guilds.cache.get(`${serverId}`);
    // SET POOL NAME
    guild.me.setNickname(`3. ${poolName3rd}`);

    // SET POOLS TOKEN VALUE AS PLAYING
    client.user.setActivity(`$${poolPrice3rd}`, {
      type: "PLAYING",
    });
    // console.log(price);
  }

  // ** INVOKE DISCORD BOT **
  client.on("ready", () => {
    console.log("Discord bot is Online, please wait while fetching data");
    setBot(); // need to call this 3 times
  });
  client.login(token); // 1 token per bot (need 3 total)
};
exports.getData = getData;
