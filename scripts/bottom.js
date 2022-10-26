import { cityNames, cityDetails, continents } from "./data.js";

let actual;
let citiesArray = [];
const continentGrid = document.querySelector(".continent-grid-display");
const continentArrow = document.querySelector(".arrow.cont");
const tempArrow = document.querySelector(".arrow.temp");

/**
 *
 * @param {*} time
 * @returns current time in format
 */
function calcTime(time) {
  var sepTime = time.split(":");
  var sepState = sepTime[2].split(" ");
  var state = sepState[1];
  var finalTime = sepTime[0] + ":" + sepTime[1] + " " + state;
  return finalTime;
}

/**
 * @description update the sort arrows on mouse click
 *
 * @param {HTMLElement} elem sort arrow element
 */
function changeSortDirection(ele) {
  if (ele.classList.contains("up")) {
    ele.setAttribute("src", "./assets/arrowDown.svg");
    ele.classList.remove("up");
    ele.classList.add("down");
  } else {
    ele.setAttribute("src", "./assets/arrowUp.svg");
    ele.classList.remove("down");
    ele.classList.add("up");
  }
}

/**
 * @function - sort cities based on continent
 * @param {*} city1
 * @param {*} city2
 */

function sortCities(city1, city2) {
  const cityName1 = cityDetails[city1.toLowerCase()];
  const cityName2 = cityDetails[city2.toLowerCase()];
  return cityName1.continent > cityName2.continent
    ? 1
    : cityName1.continent < cityName2.continent
    ? -1
    : 0;
}

/**
 * @function - sort cities based on continent's temp
 * @param {*} city1
 * @param {*} city2
 */

function sortTemp(city1, city2) {
  const cityName1 = cityDetails[city1.toLowerCase()];
  const cityName2 = cityDetails[city2.toLowerCase()];
  let temp1 = Number(
    cityName1.temperature.slice(0, cityName1.temperature.length - 2)
  );
  let temp2 = Number(
    cityName2.temperature.slice(0, cityName2.temperature.length - 2)
  );
  return temp1 > temp2 ? -1 : temp1 < temp2 ? 1 : 0;
}

/**
 * @function - to update the grid after sorting the continents
 */
function addContinentGrid(array) {
  actual = array.slice(0, 12); //12 cards in UI
  continentGrid.innerHTML = "";
  actual.forEach((city) => {
    let cityInfo = cityDetails[city.toLowerCase()];
    var dateAndTime = new Date().toLocaleString("en-US", {
      timeZone: "" + cityInfo.timeZone,
    });
    const time = calcTime(dateAndTime.split(",")[1]);

    let htmlContent = `
        <div class="continent-grid-card">
        <div class="continent-grid-row">
          <div class="yellow text-capitalize continent-font" id = "bottom-sec-continent">${
            cityInfo.continent
          }</div>
          <div class="card-deg-font">${cityInfo.temperature}</div>
        </div>
        <div class="continent-grid-row">
          <div class = "continent-font" id = "bottom-sec-time">${
            city + ", " + time
          }</div>
          <div class="card-percentage">
            <img class="humidity-icon" src="assets/humidityIcon.svg"/>
            <div class = "continent-font">${cityInfo.humidity}</div>
          </div>
        </div>
      </div>`;

    continentGrid.innerHTML += htmlContent;
  });
  setInterval(function () {
    countMinutes(actual);
  }, 1000);
}

/**
 * @description To update time by minute in card by comparing cities in continents
 * @param {object} 12 cities
 */
function countMinutes(actual) {
  const all = document.querySelectorAll("#bottom-sec-time");
  actual.forEach((city) => {
    all.forEach((ele, index) => {
      let citynow = ele.innerHTML.split(",")[0];
      let cityInfo = cityDetails[city.toLowerCase()];
      if (city === citynow) {
        var dateAndTime = new Date().toLocaleString("en-US", {
          timeZone: "" + cityInfo.timeZone,
        });
        const time = calcTime(dateAndTime.split(",")[1]);
        document.querySelectorAll("#bottom-sec-time")[index].innerHTML = `${
          city + ", " + time
        }`;
      }
    });
  });
}

/**
 * @description Sort the continents by Temperature
 * newArray[] - comparing continents array with city's continents and seperating every continent's cities in a array
 * then, sort them in asc or desc
 */

function sortByTemp() {
  let finalArray = [];
  for (let i = 0; i < continents.length; i++) {
    let newArray = [];
    citiesArray.filter((city) => {
      if (cityDetails[city.toLowerCase()].continent === continents[i]) {
        newArray.push(city);
      }
    });
    if (tempArrow.classList.contains("up")) {
      newArray.sort(sortTemp);
    } else {
      newArray.sort(sortTemp).reverse();
    }
    finalArray = finalArray.concat(newArray);
  }
  citiesArray = finalArray;

  addContinentGrid(citiesArray);
}

/**
 * @description Perform sort operation based on click event
 *
 *  key either does continent or temperature sort
 */

function performSort(e) {
  const keyParameter = e.srcElement.getAttribute("parameter");
  //console.log(keyParameter);
  //   let keyBind = { key: keyParameter };
  if (keyParameter === "continent") {
    if (e.srcElement.classList.contains("up")) {
      citiesArray.sort(sortCities);
    } else {
      citiesArray.sort(sortCities).reverse();
    }

    continents.reverse();
    addContinentGrid(citiesArray);
  }

  changeSortDirection(e.srcElement);
  sortByTemp();
}

/**
 * @description Initiate bottom section
 *
 * @export {function}
 * @param {Array} citiesArray array of city names
 */
export function bottomDisplay(cities) {
  citiesArray = cities.slice();

  // append continents name to the data object of cities
  cityNames.forEach((city) => {
    cityDetails[city.toLowerCase()].continent = cityDetails[
      city.toLowerCase()
    ].timeZone
      .split("/")[0]
      .toLowerCase();
  });

  window.performSort = performSort;

  //default setting
  continentArrow.click();
  tempArrow.click();
}
