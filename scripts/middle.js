import { cityNames, cityDetails } from "./data.js";

let topCities;

let citiesArray = [];
let cityArray = [];
let clicked;
const spinnerVal = document.querySelector("#top-city-spinner");
const citiesDisplay = document.querySelector(".top-cities-display");
const pre = document.getElementsByClassName("transition-btn")[0];
const next = document.getElementsByClassName("transition-btn")[1];

/**
 * @description to filter cities based on user-clicked icon
 * @param {string} city
 * @returns true if city is sunny/cold/rainy
 */

function filtercities(city) {
  const obj = cityDetails[city.toString().toLowerCase()];
  let temp = Number(obj.temperature.slice(0, obj.temperature.length - 2));
  let humidity = Number(obj.humidity.slice(0, obj.humidity.length - 1));
  let prec = Number(obj.precipitation.slice(0, obj.precipitation.length - 1));

  return this.key === "sunny"
    ? temp > 29 && humidity < 50 && prec >= 50
    : this.key === "cold"
    ? temp >= 20 && temp <= 28 && humidity > 50 && prec < 50
    : this.key === "rainy"
    ? temp < 20 && humidity >= 50
    : false;
}

/**
 * @description - sort cities based on icon selected
 * if sunny, based on temp
 * if cold, based on precipiation
 * if rainy, based on humidity
 * @param {string} city1
 * @param {string} city2
 */
function sortcities(city1, city2) {
  const cityName1 = cityDetails[city1.toLowerCase()];
  const cityName2 = cityDetails[city2.toLowerCase()];
  if (this.key === "sunny") {
    let temp1 = Number(
      cityName1.temperature.slice(0, cityName1.temperature.length - 2)
    );
    let temp2 = Number(
      cityName2.temperature.slice(0, cityName2.temperature.length - 2)
    );
    return temp1 > temp2 ? -1 : temp1 < temp2 ? 1 : 0;
  }
  if (this.key === "cold") {
    let pre1 = Number(
      cityName1.precipitation.slice(0, cityName1.precipitation.length - 2)
    );
    let pre2 = Number(
      cityName2.precipitation.slice(0, cityName2.precipitation.length - 2)
    );
    return pre1 > pre2 ? -1 : pre1 < pre2 ? 1 : 0;
  }
  if (this.key === "rainy") {
    let humidity1 = Number(
      cityName1.humidity.slice(0, cityName1.humidity.length - 2)
    );
    let humidity2 = Number(
      cityName2.humidity.slice(0, cityName2.humidity.length - 2)
    );
    return humidity1 > humidity2 ? -1 : humidity1 < humidity2 ? 1 : 0;
  }

  return 0;
}
/**
 * @description Calculate date for card display
 * @params {string} current date
 */
function calcDate(date) {
  var sep = date.split("/");
  const months = [
    "None",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return sep[1] + " " + months[sep[0]] + " " + sep[2];
}
/**
 * @description Calculate time for card display
 * @params {string} current time
 */
function calcTime(time) {
  var sepTime = time.split(":");
  var sepState = sepTime[2].split(" ");
  var state = sepState[1];
  var finalTime = sepTime[0] + ":" + sepTime[1] + " " + state;
  return finalTime;
}

/**
 * @description Display cities in card dynamically HTML content
 * @param {array} sorted cities array
 * @param {integer} spinner value 3-10
 */
function topcitiesDisplay(sortedcities, spinner) {
  topCities = sortedcities.slice(0, spinner);
  let click;
  if (clicked === "sunny") {
    click = "sunnyIcon";
  } else if (clicked === "cold") {
    click = "snowflakeIcon";
  } else if (clicked === "rainy") {
    click = "rainyIcon";
  }

  citiesDisplay.innerHTML = "";

  topCities.forEach((city) => {
    city = city.toLowerCase();
    let cityInfo = cityDetails[city];
    var dateAndTime = new Date().toLocaleString("en-US", {
      timeZone: "" + cityInfo.timeZone,
    });
    var date = calcDate(dateAndTime.split(",")[0]);
    const time = calcTime(dateAndTime.split(",")[1]);

    const HTMLElement = `<div class="card">
                <img class="card-city-image" src = ${
                  "./assets/cities/" + city + ".svg"
                } /> 
                <div class="top-city-info-all">
                    <div class="top-city-name-date">
                      <div class="text-capitalize" id = "middle-sec-city">${city}</div>
                      <div class="small-font" id = "middle-sec-time">${time}</div>
                      <div class="small-font">${date}</div>
                      <div class="weather-percentage">
                        <img class="parameter" src="assets/humidityIcon.svg"/>
                        <div>${cityInfo.humidity}</div>
                      </div>
                      <div class="weather-percentage">
                        <img class="parameter" src="assets/precipitationIcon.svg"/>
                        <div>${cityInfo.precipitation}</div>
                      </div>
                    </div>
                  
                    <div class="top-city-card-weather">
                      <img class="weather-icon" style="margin-right: 2px;" src= ${
                        "./assets/" + click + ".svg"
                      } />
                      <div>${cityInfo.temperature}</div>
                    </div> 
                </div>
        </div>`;
    citiesDisplay.innerHTML += HTMLElement;
  });
  setInterval(function () {
    countMinutes(topCities);
  }, 1000);
}

/**
 * @description To update time by minute in card
 * @param {object} top cities Info
 */
function countMinutes(topCities) {
  const all = document.querySelectorAll("#middle-sec-city");
  topCities.forEach((city) => {
    all.forEach((ele, index) => {
      city = city.toLowerCase();
      if (city === ele.innerHTML) {
        let cityInfo = cityDetails[city];
        var dateAndTime = new Date().toLocaleString("en-US", {
          timeZone: "" + cityInfo.timeZone,
        });
        var date = calcDate(dateAndTime.split(",")[0]);
        const time = calcTime(dateAndTime.split(",")[1]);
        document.querySelectorAll("#middle-sec-time")[index].innerHTML = time;
      }
    });
  });
}

/**
 * @description Change cities count as per user selected count
 * @topcitiesDisplay - function called if count is in range (passing cities array,count & clicked value)
 */

function countChange() {
  const count = Number(this.value);
  topcitiesDisplay(citiesArray, count);
  scrollcheck(count);
}

/**
 * @description Check the spinner value, if less than 4 pre and next buttons disable -- else, enable
 * @param {integer} input value in spinner
 */
function scrollcheck(count) {
  if (count < 4) {
    pre.classList.add("disable");
    next.classList.add("disable");
  } else {
    pre.classList.remove("disable");
    next.classList.remove("disable");
  }
}

/**
 * @description Listen to click events on the scroll arrows
 *
 * @argument {String} type forward or backward arrow
 * @argument {String} pixels add 330px for forward and minus 330ps for backward
 */
function movescroll(e) {
  const type = e.srcElement.getAttribute("direction");
  const pixels = type === "next" ? 330 : -330;

  citiesDisplay.scrollBy(pixels, 0);
}

/**
 * @description To change cities based on user clicked icon
 */

function changecities() {
  let filteredCities = [];

  clicked = event.srcElement.id;
  let keyBind = { key: clicked };

  if (clicked === "sunny") {
    document.getElementById("cold").classList.remove("border-selected");
    document.getElementById("rainy").classList.remove("border-selected");
    document.getElementById("sunny").setAttribute("class", "border-selected");
  } else if (clicked === "cold") {
    document.getElementById("sunny").classList.remove("border-selected");
    document.getElementById("rainy").classList.remove("border-selected");
    document.getElementById("cold").setAttribute("class", "border-selected");
  } else if (clicked === "rainy") {
    document.getElementById("sunny").classList.remove("border-selected");
    document.getElementById("cold").classList.remove("border-selected");
    document.getElementById("rainy").setAttribute("class", "border-selected");
  }

  filteredCities = cityArray.filter(filtercities.bind(keyBind));
  filteredCities.sort(sortcities.bind(keyBind));
  citiesArray = filteredCities;
  scrollcheck(spinnerVal.value);
  topcitiesDisplay(filteredCities, spinnerVal.value);
}
/**
 * @description Initialize middle section
 * @export {function}
 */
export function middleDisplay(cities) {
  cityArray = cities.slice();
  window.changecities = changecities;
  window.countChange = countChange.bind(spinnerVal);
  window.movescroll = movescroll;
  window.scrollcheck = scrollcheck;
  document.querySelector("#sunny").click();
}
