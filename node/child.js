//import modules
const timeZone = require("./timeZone");

//child processes to execute based on message sent from server.js
process.on("message", (message) => {
  if (message.method === "/allcities") {
    process.send(timeZone.allTimeZones());
    process.exit();
  } else if (message.method === "/city") {
    process.send(timeZone.timeForOneCity(message.cityName));
    process.exit();
  } else if (message.method === "/hourly-forecast") {
    process.send(
      timeZone.nextNhoursWeather(
        message.cityTDN,
        message.hours,
        timeZone.allTimeZones()
      )
    );
    process.exit();
  }
});
