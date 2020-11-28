const { request, gql } = require('graphql-request');
const timestamp = require('time-stamp');
const cron = require('node-cron');

const { ethers } = require('ethers');

const firstPlaceBot = require('./firstPlace');
const secondPlaceBot = require('./secondPlace');
const thirdPlaceBot = require('./thirdPlace');

const query = gql`
  {
    funds(sortBy: "score", order: "DESC", page: 1, pageSize: 3) {
      content {
        address
        name
        tokenPrice
        performance
        totalValue
      }
    }
  }
`;

const url = 'https://api.dhedge.org/graphql';

let poolName1st = '';
let poolPerformance1st = 0;
let poolTotalValue1st = 0;

let poolName2nd = '';
let poolPerformance2nd = 0;
let poolTotalValue2nd = 0;

let poolName3rd = '';
let poolPerformance3rd = 0;
let poolTotalValue3rd = 0;

const getData = () => {
  const fetchQuery = () => {
    request(url, query).then((data) => {
      const timeStamp = timestamp.utc('YYYY/MM/DD:mm:ss');

      const funds = data.funds.content;
      const leaders = funds.map((pool) => {
        return {
          price: pool.tokenPrice,
          pool: pool.name,
          performance: pool.performance,
          totalValue: pool.totalValue,
        };
      });

      console.log(leaders);

      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      });

      // FIRST PLACE
      poolName1st = leaders[0].pool.substring(0, 28);
      poolPerformance1st = parseFloat(
        ethers.utils.formatUnits(leaders[0].performance, 18)
      );
      poolPerformance1st = Number((poolPerformance1st - 1) * 100).toFixed(2);
      poolTotalValue1st = formatter.format(
        ethers.utils.formatUnits(leaders[0].totalValue, 18)
      );

      // SECOND PLACE
      poolName2nd = leaders[1].pool.substring(0, 28);
      poolPerformance2nd = parseFloat(
        ethers.utils.formatUnits(leaders[1].performance, 18)
      );
      poolPerformance2nd = Number((poolPerformance2nd - 1) * 100).toFixed(2);
      poolTotalValue2nd = formatter.format(
        ethers.utils.formatUnits(leaders[1].totalValue, 18)
      );

      // THIRD PLACE
      poolName3rd = leaders[2].pool.substring(0, 28);
      poolPerformance3rd = parseFloat(
        ethers.utils.formatUnits(leaders[2].performance, 18)
      );
      poolPerformance3rd = Number((poolPerformance3rd - 1) * 100).toFixed(2);
      poolTotalValue3rd = formatter.format(
        ethers.utils.formatUnits(leaders[2].totalValue, 18)
      );

      console.log(`*fetched at: ${timeStamp}`);

      return {
        poolName1st,
        poolPerformance1st,
        poolTotalValue1st,
        poolName2nd,
        poolPerformance2nd,
        poolTotalValue2nd,
        poolName3rd,
        poolPerformance3rd,
        poolTotalValue3rd,
      };
    });
  };

  cron.schedule('*/60 * * * * *', () => {
    console.log('------');
    console.log(
      timestamp.utc('[YYYY/MM/DD:mm:ss]') + 'running a task every 60 sec'
    );
    fetchQuery();
    firstPlaceBot.setBot(poolName1st, poolPerformance1st, poolTotalValue1st);
    secondPlaceBot.setBot(poolName2nd, poolPerformance2nd, poolTotalValue2nd);
    thirdPlaceBot.setBot(poolName3rd, poolPerformance3rd, poolTotalValue3rd);
  });
};
exports.getData = getData;
