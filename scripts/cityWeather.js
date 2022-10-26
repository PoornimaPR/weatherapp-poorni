import { cityDetailsObject } from "./basePrototype.js";
import { getHourlyData } from "./http.js";

export let currentCity;
let cityName;

/**
 * @class - currentCityClass extends cityDetailsObject class and inherits the props of the other class
 * in constructor call super
 *
 */

class currCityClass extends cityDetailsObject {
  constructor(name) {
    super(name);
  }

  /**
   * @description get weather forecast details for next 4 hours
   * @param {string} cityName
   */

  async getNextFiveHrs(cityName) {
    let data = await getHourlyData(cityName);
    this.nextFiveHrs = data.temperature;
    for (let i = 0; i < this.nextFiveHrs.length; i++) {
      document.getElementById("weather-temp-" + i).innerHTML =
        this.nextFiveHrs[i];
      const time = currentCity.calcTime();
      document.getElementById("weather-img-" + i).src =
        "./assets/" + weatherIcon(this.nextFiveHrs[i]) + ".svg";
      if (time[3] === "AM") {
        if (Number(time[0]) + 1 + i < 12) {
          document.getElementById("weather-time-" + i).innerHTML =
            Number(time[0]) + 1 + i + time[3];
        } else if (Number(time[0]) + 1 + i === 12) {
          document.getElementById("weather-time-" + i).innerHTML =
            Number(time[0]) + 1 + i + "PM";
        } else {
          document.getElementById("weather-time-" + i).innerHTML =
            Number(time[0]) + 1 + i - 12 + "PM";
        }
      } else if (time[3] === "PM") {
        if (Number(time[0]) + 1 + i < 12) {
          document.getElementById("weather-time-" + i).innerHTML =
            Number(time[0]) + 1 + i + time[3];
        } else if (Number(time[0]) + 1 + i === 12) {
          document.getElementById("weather-time-" + i).innerHTML =
            Number(time[0]) + 1 + i + "AM";
        } else {
          document.getElementById("weather-time-" + i).innerHTML =
            Number(time[0]) + 1 + i - 12 + "AM";
        }
      }
    }
  }
}
/**
 * @description select sunny,cloudy or windy based on temperature of city
 * @param {number} icon
 * @returns icon name
 */
function weatherIcon(icon) {
  icon = icon.slice(0, -2);
  if (icon > 29) {
    return "sunnyIcon";
  } else if (icon >= 23 && icon <= 29) {
    return "cloudyIcon";
  } else if (icon >= 18 && icon <= 22) {
    return "windyIcon";
  } else {
    return "rainyIcon";
  }
}

/**
 * @description function to create current city object reference
 *
 * @export function
 * @param {String} cityName name of the current selected city
 */
export function updateCurrentCityRef(cityName) {
  currentCity = new currCityClass(cityName);
}
