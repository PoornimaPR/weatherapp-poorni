const httpReq = new XMLHttpRequest();
let hostname = location.hostname;
let port = location.port;

/**
 * @description get all city details
 */

export async function getCityDetails() {
  //const url = "https://soliton.glitch.me/all-timezone-cities";
  const url = `http://${hostname}:${port}/allcities`;
  return sendReq("GET", url);
}

/**
 * @description Send any HTTP request to the server
 * created a promise for resolve/reject the response.
 * First,open the connection with method and url. Then, set header
 * If onload, get data from response else error
 * Lastly, send data
 * return the httpPromise that has data
 *
 */

function sendReq(method, url, data) {
  const httpPromise = new Promise((resolve, reject) => {
    httpReq.open(method, url);

    httpReq.setRequestHeader("Content-type", "application/json");

    httpReq.onload = () => {
      if (httpReq.status >= 400) {
        console.log("error:", error);
        reject("No Response", error);
      } else {
        let data = JSON.parse(httpReq.response);
        resolve(data);
      }
    };

    httpReq.onerror = (error) => {
      console.log("error:", error);
      reject("No Response", error);
    };

    httpReq.send(JSON.stringify(data));
  });
  return httpPromise;
}

/**
 * @description Get hourly weather forecast for a city
 *
 * @export getHourlyData
 * @param {String} cityName name of the city
 * @argument {String} formatCity capitalized city name
 * @argument {String} getUrl HTTP url to get request body object
 * @argument {String} postUrl HTTP url to get wether forecast data
 *
 * @returns {Promise} Either resolved or rejected HTTP response
 */
export async function getHourlyData(cityName) {
  let city = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  //const getURL = "https://soliton.glitch.me?city=" + city;
  const getURL = `http://${hostname}:${port}/city?city=` + city;
  //const postURL = "https://soliton.glitch.me/hourly-forecast";
  const postURL = `http://${hostname}:${port}/hourly-forecast`;
  let bodyData = {};

  const nextFiveHours = new Promise((resolve, reject) => {
    sendReq("GET", getURL)
      .then((data) => {
        bodyData = data;
        bodyData.hours = 4;
        bodyData = JSON.stringify(bodyData);
        sendReq("POST", postURL, bodyData).then((data) => {
          resolve(data);
        });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });

  let hourlyData = await nextFiveHours;
  return hourlyData;
}
