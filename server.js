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
  let pool = "";
  let price = 0;

  let first = 0;
  let second = 0;
  let third = 0;

  request("https://dev.dhedge.org/graphql", query).then((data) => {
    const funds = data.funds.content;
    // console.log(funds);
    const leaders = funds.map((fund) => {
      return {
        price: fund.tokenPrice,
        pool: fund.fundName,
      };
    });

    console.log(leaders);
    // take the above array of funds' prices, take the first one only
    first = leaders[0].price;
    testName = leaders[0].pool;

    return leaders;
  });

  // function to set a single bot
  // what if we passed in a argument, could we dynamically do setNickname & setActivity 3 times (DRY CODE)
  async function fetchIt() {
    const guild = client.guilds.cache.get(`${serverId}`);
    // console.log(guild);

    // SET POOL NAME
    guild.me.setNickname(`1st) ${testName} 🏆`);

    // SET POOLS TOKEN VALUE AS PLAYING
    client.user.setActivity(`$${first}`, {
      type: "PLAYING",
    });
  }

  // ** INVOKE DISCORD BOT **
  client.on("ready", () => {
    console.log("Discord bot is Online, please wait while fetching data");
    fetchIt();
  });
  client.login(token);
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
