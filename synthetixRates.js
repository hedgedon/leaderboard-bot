const { request, gql } = require("graphql-request");
const timestamp = require("time-stamp");
const cron = require("node-cron");

const { ethers } = require("ethers");

const bot = require("./discordBot");

const query = gql`
  {
    xau: rateUpdates(
      first: 1
      orderBy: block
      orderDirection: desc
      where: { synth: "sXAU" }
    ) {
      block
      synth
      rate
    }
    xag: rateUpdates(
      first: 1
      orderBy: block
      orderDirection: desc
      where: { synth: "sXAG" }
    ) {
      block
      synth
      rate
    }
    sdefi: rateUpdates(
      first: 1
      orderBy: block
      orderDirection: desc
      where: { synth: "sDEFI" }
    ) {
      block
      synth
      rate
    }
  }
`;

const url =
  "https://api.thegraph.com/subgraphs/name/synthetixio-team/synthetix-rates";

let sXAU = "";
let sXAURate = 0;

let sXAG = "";
let sXAGRate = 0;

let sDEFI = "";
let sDEFIRate = 0;

const fetchQuery = () => {
  request(url, query).then((data) => {
    const timeStamp = timestamp.utc("YYYY/MM/DD:mm:ss");

    sXAU = data.xau[0].synth;
    sXAURate = Number(ethers.utils.formatEther(data.xau[0].rate)).toFixed(2);

    sXAG = data.xag[0].synth;
    sXAGRate = Number(ethers.utils.formatEther(data.xag[0].rate)).toFixed(2);

    sDEFI = data.sdefi[0].synth;
    sDEFIRate = Number(ethers.utils.formatEther(data.sdefi[0].rate)).toFixed(2);

    console.log(sXAU, sXAURate);
    console.log(sXAG, sXAGRate);
    console.log(sDEFI, sDEFIRate);

    console.log(`*fetched at: ${timeStamp}`);

    return { sXAU, sXAG, sDEFI };
  });
};

cron.schedule("*/5 * * * * *", () => {
  console.log("------");
  console.log("running a task every 5 second");
  fetchQuery();
  bot.getData(sXAU, sXAURate);
});
