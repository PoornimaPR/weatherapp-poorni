//import modules
const express = require("express");
const app = express();
const { fork } = require("child_process");
const path = require("path");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

const timeZone = require("./timeZone");
const data = timeZone.allTimeZones();

// Server PORT number
let port = process.env.PORT || 3000;

//Render html,css,js and img files
app.use("/static", express.static(path.join(__dirname, "../")));

app.get("/", function (req, res) {
  let indexPath = path.join(__dirname, "../index.html");
  res.sendFile(indexPath);
});

app.get("/*.css", function (req, res) {
  let indexPath = path.join(__dirname, ".." + req.url);
  res.sendFile(indexPath);
});

app.get("/scripts/*.js", function (req, res) {
  let indexPath = path.join(__dirname, ".." + req.url);
  res.sendFile(indexPath);
});

app.get("/assets/*.svg", function (req, res) {
  let indexPath = path.join(__dirname, ".." + req.url);
  res.sendFile(indexPath);
});

app.get("/assets/*.png", function (req, res) {
  let indexPath = path.join(__dirname, ".." + req.url);
  res.sendFile(indexPath);
});

// send all cities timeZone
app.get("/allcities", (req, res) => {
  const childProcess = fork("./child.js");
  childProcess.send({ method: "/allcities" });
  childProcess.on("message", (message) => {
    res.send(message);
    childProcess.kill();
  });
});

// send a city name to get city date time & name
app.get("/city", (req, res) => {
  let city = req.query.city;
  if (city) {
    const childProcess = fork("./child.js");
    childProcess.send({ method: "/city", cityName: `${req.query.city}` });
    childProcess.on("message", (message) => {
      res.send(message);
      childProcess.kill();
    });
  }
});

// send hourly forecast for one city
app.post("/hourly-forecast", (req, res) => {
  let body = [];
  req.on("data", (data) => {
    body += JSON.parse(data);
  });

  req.on("end", () => {
    body = JSON.parse(body);
    let city_Date_Time = body.city_Date_Time_Name;
    let hours = body.hours;
    if (city_Date_Time && hours) {
      const childProcess = fork("./child.js");
      childProcess.send({
        method: "/hourly-forecast",
        cityTDN: `${body.city_Date_Time_Name}`,
        hours: `${body.hours}`,
      });
      childProcess.on("message", (message) => {
        res.send(message);
        childProcess.kill();
      });
    } else {
      res.writeHead(404);
      res.end("Error message");
    }
  });
});

//Server listening to port
app.listen(port, () => console.log("Listening on port" + " " + port));
