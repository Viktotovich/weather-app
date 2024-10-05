/* eslint-disable */
import { dataProcessor, requestsController } from "./requests-manager";
//requestsController.createRequest("dubai");

import capitals from "./json/capitals.json";
import { iconFinder } from "./icon-manager";

// This imports everything, and does not export anything except the function to initiate

let preferredTemparature = "C";

const domController = {
  initiateDom: function () {
    const suggestionContainer = document.querySelector("#search-suggestions");
    const submitSearch = document.querySelector("#submit-search");
    const toggleTemperature = document.querySelector(".temperature-toggle");

    submitSearch.addEventListener("click", domController.searchWeather);
    toggleTemperature.addEventListener(
      "click",
      domController.changePreferredTemp
    );

    this.fillSuggestions(suggestionContainer);
  },
  searchWeather: function (e) {
    e.preventDefault();
    const searchInput = document.querySelector("#search");
    const searchValue = searchInput.value;

    if (errorChecker.checkInput(searchInput) === true) {
      searchInput.setAttribute("class", "valid-search");
      errorChecker.clearErrorDisplay();

      requestsController
        .createRequest(searchValue)
        .then((replyObj) => {
          domController.receiveReply(replyObj);
        })
        .catch((err) => {
          console.error(`${err.name} at ${err.stack}. ${err}`);
        });
    } else {
      searchInput.setAttribute("class", "invalid-search");
    }
  },
  receiveReply: function ({ currentPeriod, weatherPeriod }) {
    console.log(currentPeriod, weatherPeriod);

    //process currentPeriod, and process weatherPeriod
    currentWeatherController.processCurrentWeather(currentPeriod[0]);

    weatherPeriodController.processWeatherPeriod(weatherPeriod[0]);
  },
  fillSuggestions: function (suggestionContainer) {
    Object.values(capitals).forEach((capital) => {
      let capitalContainer = document.createElement("option");
      capitalContainer.setAttribute("value", capital);

      suggestionContainer.appendChild(capitalContainer);
    });
  },
  changePreferredTemp: function () {
    if (preferredTemparature === "C") {
      preferredTemparature = "F";
    } else {
      preferredTemparature = "C";
    }
  },
};

const currentWeatherController = {
  processCurrentWeather: function (data) {
    //forEach weatherPeriod's hour create a weather card, and append it. You need icons for this
    const cityName = document.querySelector("#city-name");
    const localTime = document.querySelector("#local-time");
    const currentTemp = document.querySelector(".current-temp");
    const moreInfo = document.querySelector(".more-info");
    const weatherDescription = document.querySelector(
      ".current-weather-description"
    );
    const currentWeatherIcon = document.querySelector(".current-weather-icon");

    const weatherIcon = iconFinder.processCondition(data.icon);

    localTime.textContent = data.dateTimePeriod;
    currentTemp.textContent = data.tempC;
    cityName.textContent = data.address;
    weatherDescription.textContent = data.description;

    //find the right icon
    currentWeatherIcon.appendChild(weatherIcon);

    //TODO: Garbage collect old eventListeners, best case would be if we strip everything from index.html and add it in through DOM
    moreInfo.addEventListener("click", currentWeatherController.openMoreInfo);
  },
  openMoreInfo: function () {
    //create a modal, the modal will contain all other information
  },
};

const weatherPeriodController = {
  processWeatherPeriod: function (weatherPeriodData) {
    //
  },
};
const errorChecker = {
  searchErrorDisplay: document.querySelector("#search-error-display"),
  clearErrorDisplay: function () {
    errorChecker.searchErrorDisplay.textContent = "";
  },
  checkInput: function (searchInput) {
    const inputValue = searchInput.value;
    if (!inputValue) {
      this.searchErrorDisplay.textContent =
        "You cannot leave the search field blank!";
    } else if (searchInput.validity.tooShort) {
      this.searchErrorDisplay.textContent = "Not enough characters entered";
      return false;
    } else if (searchInput.validity.tooLong) {
      this.searchErrorDisplay.textContent = "Too many characters entered";
      return false;
    } else {
      return true;
    }
  },
};

export { domController };

/* TODO:
  * 1 - Make a default load, make it be Dubai - and let dom-manager make the initial request. 
  * 2 - Find a way to save the user's previous interaction via localstorage API and make it the default
  * 3 - Limit the requests on the search button / set a limit how many times can a button be pressed in a certain time 
  * 4 - Connect Gify API 

General tasks:
1 - Date-fns (but find a way to work without it)
2 - Convert time to DD-MM
3 - Promises.race([prX, setTimeoutIfPromiseDoesntReply]) - incase the data entered is wrong or there is an error in the function: use a setTimeout function to reject() and abort process.
4 - Garbage collect promises, using .finally()
5 - F to C and C to F toggle
6 - More info option

*/
