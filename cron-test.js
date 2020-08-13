const cron = require("node-cron");
const timestamp = require("time-stamp");

cron.schedule("*/5 * * * * *", () => {
  console.log("running a task every 5 second");
  console.log(timestamp.utc("YYYY/MM/DD:mm:ss"));
});

// cron.schedule('*/2 * * * *', () => {
//   console.log('running a task every two minutes');
// });
