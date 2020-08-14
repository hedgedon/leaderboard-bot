const { request, gql } = require("graphql-request");
const timestamp = require("time-stamp");
const cron = require("node-cron");

const { ethers } = require("ethers");

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

const fetchQuery = () => {
  request(url, query).then((data) => {
    const timeStamp = timestamp.utc("YYYY/MM/DD:mm:ss");

    const sXAU = data.xau[0].synth;
    const sXAURate = Number(ethers.utils.formatEther(data.xau[0].rate)).toFixed(
      2
    );

    const sXAG = data.xag[0].synth;
    const sXAGRate = Number(ethers.utils.formatEther(data.xag[0].rate)).toFixed(
      2
    );

    const sDEFI = data.sdefi[0].synth;
    const sDEFIRate = Number(
      ethers.utils.formatEther(data.sdefi[0].rate)
    ).toFixed(2);

    console.log(sXAU, sXAURate);
    console.log(sXAG, sXAGRate);
    console.log(sDEFI, sDEFIRate);
    console.log(`*fetched at: ${timeStamp}`);
  });
};

cron.schedule("*/5 * * * * *", () => {
  console.log("------");
  console.log("running a task every 5 second");
  fetchQuery();
});
