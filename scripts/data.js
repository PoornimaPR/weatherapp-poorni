import { getCityDetails } from "./http.js";

let cityNames = [];
let cityDetails = {};
await getCityDetails().then((data) => {
  cityDetails = data.reduce((acc, curr) => {
    acc[curr.cityName.toLowerCase()] = curr;
    return acc;
  }, {});
  cityNames = data.map((city) => city.cityName).sort();
});

const continents = [
  "south america",
  "pacific",
  "north america",
  "europe",
  "australia",
  "asia",
  "antartica",
  "africa",
];

/**
 * @export {function}
 */
export { cityNames, cityDetails, continents };
