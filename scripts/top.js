import { cityNames, cityDetails } from "./data.js";

import { currentCity, updateCurrentCityRef } from "./cityWeather.js";

const input = document.querySelector("#city-name");

let interval;

/**
 * @description - function to list dropdowns to cityName input
 * - all cities when nothing is typed, specific city when a letter is typed.
 * @param {string} inp
 * @param {array} arr
 */

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    //if (!val) { return false; }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          selectedCity(inp.value);
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });

  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
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
 * @function - after setting the input box and city image -- time,date calculated here
 * @param {string} currentCity
 */

function remainingSection(currentCity) {
  document.getElementById("date").innerHTML = currentCity.calcDate();
  const time = currentCity.calcTime();
  const HM = time[0] + ":" + time[1];
  const Sec = ":" + time[2];
  document.getElementById("HM").innerHTML = HM;
  document.getElementById("sec").innerHTML = Sec;
  if (time[3] === "AM") {
    document.getElementById("AM-PM-icon").src = "./assets/amState.svg";
  } else if (time[3] === "PM") {
    document.getElementById("AM-PM-icon").src = "./assets/pmState.svg";
  }

  document.getElementById("weather-temp-now").innerHTML =
    currentCity.temperature;
  document.getElementById("weather-img-now").src =
    "./assets/" + weatherIcon(currentCity.temperature) + ".svg";
}

/**
 * @description Update  top section based on input city and call the func to get next five hours data
 * @param {string} currCity
 */
function selectedCity(currCity) {
  updateCurrentCityRef(currCity);
  clearInterval(interval);
  document.getElementById("Celcius").innerHTML = currentCity.temperature;
  document.getElementById("Humidity").innerHTML = currentCity.humidity;
  document.getElementById("Percipitation").innerHTML =
    currentCity.precipitation;
  document.getElementById("Fahrenheit").innerHTML = currentCity.tempF();
  document.getElementById("city-image").src =
    "./assets/cities/" + currCity.toLowerCase() + ".svg";
  interval = setInterval(function () {
    remainingSection(currentCity);
  }, 1000);

  currentCity.getNextFiveHrs(currCity);
  setTimeout(function () {
    currentCity.getNextFiveHrs(currCity);
  }, 60000);
}

/**
 * @description Initialize top section
 * @export {function}
 */
export function topDisplay() {
  window.autocompleteinput = autocomplete(input, cityNames);
  selectedCity(input.value);
}
