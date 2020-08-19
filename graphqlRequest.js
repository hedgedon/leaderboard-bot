const { request, gql } = require("graphql-request");
const timestamp = require("time-stamp");
const cron = require("node-cron");

const { ethers } = require("ethers");

const firstPlaceBot = require("./firstPlace");
const secondPlaceBot = require("./secondPlace");
const thirdPlaceBot = require("./thirdPlace");


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

let poolName1st = "";
let poolPrice1st = 0;

let poolName2nd = "";
let poolPrice2nd = 0;

let poolName3rd = "";
let poolPrice3rd = 0;


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

      // FIRST PLACE
      poolName1st = leaders[0].pool;
      poolPrice1st = Number(ethers.utils.formatEther(leaders[0].price)).toFixed(
        2
      );

      // SECOND PLACE
      poolName2nd = leaders[1].pool;
      poolPrice2nd = Number(ethers.utils.formatEther(leaders[1].price)).toFixed(
        2
      );

      // THIRD PLACE
      poolName3rd = leaders[2].pool;
      poolPrice3rd = Number(ethers.utils.formatEther(leaders[2].price)).toFixed(
        2
      );

      console.log(`*fetched at: ${timeStamp}`);

      return {
        poolName1st,
        poolPrice1st,
        poolName2nd,
        poolPrice2nd,
        poolName3rd,
        poolPrice3rd
      };
    });
  };

  cron.schedule("*/15 * * * *", () => {
    console.log("------");
    console.log(
      timestamp.utc("[YYYY/MM/DD:mm:ss]") + "running a task every 15 mins"
    );
    fetchQuery();
    firstPlaceBot.getData(poolName1st, poolPrice1st);
    secondPlaceBot.getData(poolName2nd, poolPrice2nd);
    thirdPlaceBot.getData(poolName3rd, poolPrice3rd);
  });
};
exports.getData = getData;
