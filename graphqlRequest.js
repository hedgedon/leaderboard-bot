const { request, gql } = require("graphql-request");
const timestamp = require("time-stamp");
const cron = require("node-cron");

const { ethers } = require("ethers");

// const firstPlaceBot = require("./firstPlace");
// const secondPlaceBot = require("./secondPlace");
// const thirdPlaceBot = require("./thirdPlace");
const fourthPlaceBot = require("./fourthPlace");
const fifthPlaceBot = require("./fifthPlace");

const query = gql`
  {
    funds(sortBy: "tokenPrice", order: "DESC", page: 1, pageSize: 5) {
      content {
        address
        fundName
        managerName
        tokenPrice
      }
    }
  }
`;

const url = "https://api.dhedge.org/graphql";

// let poolName1st = "";
// let poolPrice1st = 0;

// let poolName2nd = "";
// let poolPrice2nd = 0;

// let poolName3rd = "";
// let poolPrice3rd = 0;

let poolName4th = "";
let poolPrice4th = 0;

let poolName5th = "";
let poolPrice5th = 0;

const getData = () => {
  const fetchQuery = () => {
    request(url, query).then((data) => {
      const timeStamp = timestamp.utc("YYYY/MM/DD:mm:ss");

      const funds = data.funds.content;
      const leaders = funds.map((fund) => {
        return {
          price: fund.tokenPrice,
          pool: fund.fundName,
        };
      });

      console.log(leaders);

      // FOURTH PLACE
      poolName4th = leaders[3].pool;
      poolPrice4th = Number(ethers.utils.formatEther(leaders[3].price)).toFixed(
        2
      );

      // FIFTH PLACE
      poolName5th = leaders[4].pool;
      poolPrice5th = Number(ethers.utils.formatEther(leaders[4].price)).toFixed(
        2
      );

      console.log(`*fetched at: ${timeStamp}`);

      return {
        poolName4th,
        poolPrice4th,
        poolName5th,
        poolPrice5th,
      };
    });
  };

  cron.schedule("*/30 * * * * *", () => {
    console.log("------");
    console.log(
      timestamp.utc("[YYYY/MM/DD:mm:ss]") + "running a task every 30 sec"
    );
    fetchQuery();
    // firstPlaceBot.getData(poolName1st, poolPrice1st);
    // secondPlaceBot.getData(poolName2nd, poolPrice2nd);
    // thirdPlaceBot.getData(poolName3rd, poolPrice3rd);
    fourthPlaceBot.setBot(poolName4th, poolPrice4th);
    fifthPlaceBot.setBot(poolName5th, poolPrice5th);
  });
};
exports.getData = getData;
