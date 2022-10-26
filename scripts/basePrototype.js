import { cityDetails } from "./data.js";

/**
 * @description class cityDetailsObject - has constructors and funcs
 *
 * @param {String} name city name
 * @argument {String} Date current date for the city's time zone
 * @argument {String} Time current timestamp
 * @argument {String} timeZone city's timezone
 * @argument {Number} temperature temperature in celsius
 * @argument {Number} humidity humidity in %
 * @argument {Number} precipitation precipitation in %
 * @argument {Array} nextFiveHrs weather data
 */

class cityDetailsObject {
  constructor(name) {
    this.name = name.toLowerCase();
    this.date = cityDetails[this.name].dateAndTime.split(",")[0];
    this.time = cityDetails[this.name].dateAndTime.split(",")[1];
    this.timeZone = cityDetails[this.name].timeZone;
    this.temperature = cityDetails[this.name].temperature;
    this.humidity = cityDetails[this.name].humidity;
    this.precipitation = cityDetails[this.name].precipitation;
    this.nextFiveHrs = cityDetails[this.name].nextFiveHrs;
  }

  /**
   * @description Get the temperature in fahrenheit
   *
   * @returns temp in fahrenheit
   */

  tempF() {
    const tempC = this.temperature.slice(0, -2);
    return Math.round(tempC * 1.8 + 32).toString() + " F";
  }

  /**
   * @description Get the date in this format - 10-Mar-2022
   *
   * @returns date in format
   */

  calcDate() {
    var dateAndTime = new Date().toLocaleString("en-US", {
      timeZone: "" + this.timeZone,
    });
    var date = dateAndTime.split(",")[0];
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
    return sep[1] + "-" + months[sep[0]] + "-" + sep[2];
  }

  /**
   * @description Take time and sep them into 4 parts (hours,min,secs and state) to access them as our wish
   *
   * @returns time seperated into 4 parts (hours,min,secs and state)
   */

  calcTime() {
    var dateAndTime = new Date().toLocaleString("en-US", {
      timeZone: "" + this.timeZone,
    });
    var time = dateAndTime.split(",")[1];
    var sepTime = time.split(":");
    var sepState = sepTime[2].split(" ");
    var state = sepState[1];
    var finalTime = [sepTime[0], sepTime[1], sepState[0], state];
    return finalTime;
  }
}

export { cityDetailsObject };
