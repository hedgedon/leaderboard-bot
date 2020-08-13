require("dotenv").config();

const { request, gql } = require("graphql-request");
const timestamp = require("time-stamp");
const cron = require("node-cron");

// DISCORD CONFIG
// Discord.js Config
const Discord = require("discord.js");
const client = new Discord.Client();
const token = process.env.BOT_TOKEN;
const serverId = process.env.DEV_SERVER_ID;

const query = gql`
  {
    funds(sortBy: "tokenPrice", order: "DESC", page: 1, pageSize: 3) {
      content {
        address
        fundName
        managerName
        tokenPrice
      }
    }
  }
`;

// TODOS
// 1) DEFINE FETCH FUNCTION TO SET SINGLE BOT
// 2) FETCH DATA

// FETCH DATA AND SET THE NICKNAME EVERY X SECONDS
const fetchData = () => {
  let pool1 = "";
  let price1 = 0;

  let pool2 = "";
  let price2 = 0;

  let pool3 = "";
  let price3 = 0;

  request("https://dev.dhedge.org/graphql", query).then((data) => {
    const funds = data.funds.content;
    const leaders = funds.map((fund) => {
      return {
        price: fund.tokenPrice,
        pool: fund.fundName,
      };
    });

    console.log(leaders);
    pool1 = leaders[0].pool;
    price1 = leaders[0].price;

    pool2 = leaders[1].pool;
    price2 = leaders[1].price;

    pool3 = leaders[2].price;
    price3 = leaders[2].price;

    return leaders;
  });

  // function to set a single bot
  // what if we passed in a argument, could we dynamically do setNickname & setActivity 3 times (DRY CODE)
  async function setBot() {
    const guild = client.guilds.cache.get(`${serverId}`);
    // SET POOL NAME
    guild.me.setNickname(`1st) ${pool2} 🏆`);

    // SET POOLS TOKEN VALUE AS PLAYING
    client.user.setActivity(`$ ${price2}`, {
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

// Every 2 seconds, call the GraphQL API
// additionally, update the discord bot's name and playing activity
cron.schedule("*/5 * * * * *", () => {
  console.log(
    timestamp.utc("YYYY/MM/DD:mm:ss"),
    ": querying the api every 5 seconds"
  );
  fetchData();
});
