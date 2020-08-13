require("dotenv").config();

const { request, gql } = require("graphql-request");
const timestamp = require("time-stamp");
const cron = require("node-cron");

const firstPlace = require("./firstPlace");
const secondPlace = require("./secondPlace");

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

let poolName1st = "";
let poolPrice1st = 0;

let poolName2nd = "";
let poolPrice2nd = 0;

let poolName3rd = "";
let poolPrice3rd = 0;

request("https://dev.dhedge.org/graphql", query).then((data) => {
  const funds = data.funds.content;
  const leaders = funds.map((fund) => {
    return {
      price: fund.tokenPrice,
      pool: fund.fundName,
    };
  });

  console.log(leaders);
  poolName1st = leaders[0].pool;
  poolPrice1st = leaders[0].price;

  poolName2nd = leaders[1].pool;
  poolPrice2nd = leaders[1].price;

  poolName3rd = leaders[2].pool;
  poolPrice3rd = leaders[2].price;

  return leaders;
});

// Every 5 seconds, call the GraphQL API
// additionally, update the discord bot's name and playing activity
cron.schedule("*/5 * * * * *", () => {
  console.log(
    timestamp.utc("YYYY/MM/DD:mm:ss"),
    ": querying the api every 5 seconds"
  );
  // fetchData(); // can we call
  firstPlace.getData(poolName1st, poolPrice1st);
  secondPlace.getData(poolName2nd, poolPrice2nd);
});
