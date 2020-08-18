const { request, gql } = require("graphql-request");
const timestamp = require("time-stamp");
const cron = require("node-cron");

const { ethers } = require("ethers");

// const firstPlaceBot = require("./firstPlace");
// const firstPlaceBot = require("./firstPlace");
// const firstPlaceBot = require("./firstPlace");
const fourthPlaceBot = require("./fourthPlace");
const fifthPlaceBot = require("./fifthPlace");

const query = gql`
  {
    funds(sortBy: "tokenPrice", order: "DESC", page: 1, pageSize: 10) {
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

let poolName1st = "";
let poolPrice1st = 0;

let poolName2nd = "";
let poolPrice2nd = 0;

let poolName3rd = "";
let poolPrice3rd = 0;

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
      poolName1st = leaders[0].pool;
      poolPrice1st = Number(ethers.utils.formatEther(leaders[0].price)).toFixed(
        2
      );

      // TEST ONLY 4th and 5th POOL
      poolName4th = leaders[3].pool;
      poolPrice4th = Number(ethers.utils.formatEther(leaders[3].price)).toFixed(
        2
      );
      // FIFTH PLACE
      poolName5th = leaders[4].pool;
      poolPrice5th = Number(ethers.utils.formatEther(leaders[4].price)).toFixed(
        2
      );

      // console.log(poolName1st, poolPrice1st);

      console.log(`*fetched at: ${timeStamp}`);
      // console.log(funds);

      // return the others here
      return {
        poolName1st,
        poolPrice1st,
        poolName4th,
        poolPrice4th,
        poolName5th,
        poolPrice5th,
      };
    });
  };

  cron.schedule("*/60 * * * * *", () => {
    console.log("------");
    console.log(
      timestamp.utc("[YYYY/MM/DD:mm:ss]") + "running a task every 5 sec"
    );
    fetchQuery();
    fourthPlaceBot.getData(poolName4th, poolPrice4th);
    fifthPlaceBot.getData(poolName5th, poolPrice5th);
    // fourthPlaceBot.getData(poolName4th, poolPrice4th);
    // fourthPlaceBot.getData(poolName4th, poolPrice4th);
    // xauBot.getData(sXAU, sXAURate);
    // xagBot.getData(sXAG, sXAGRate);
    // defiBot.getData(sDEFI, sDEFIRate);
  });
};
exports.getData = getData;
