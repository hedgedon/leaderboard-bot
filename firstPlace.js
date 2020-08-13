require("dotenv").config();

const getData = (poolName1st, poolPrice1st) => {
  // DISCORD CONFIG
  // Discord.js Config
  const Discord = require("discord.js");
  const client = new Discord.Client();
  const token = process.env.BOT_TOKEN;
  const serverId = process.env.DEV_SERVER_ID;

  console.log(poolName1st, poolPrice1st);

  async function setBot() {
    const guild = client.guilds.cache.get(`${serverId}`);
    // SET POOL NAME
    guild.me.setNickname(`1st) ${poolName1st} 🏆`);

    // SET POOLS TOKEN VALUE AS PLAYING
    client.user.setActivity(`$${poolPrice1st}`, {
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
