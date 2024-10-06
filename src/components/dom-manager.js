/* eslint-disable */
import { dataProcessor, requestsController } from "./requests-manager";
import capitals from "./json/capitals.json";
import { iconFinder } from "./icon-manager";

//To avoid Dom troubles, it's best to save the data here itself
let preferredTemparature = "C";
let savedCurrentData = [];
let savedPeriodData = [];

const domController = {
  initiateDom: function () {
    const suggestionContainer = document.querySelector("#search-suggestions");
    const submitSearch = document.querySelector("#submit-search");
    const toggleTemperature = document.querySelector(".temperature-toggle");
    const moreInfoCurrent = document.querySelector(".more-info");

    submitSearch.addEventListener("click", domController.searchWeather);
    moreInfoCurrent.addEventListener(
      "click",
      currentWeatherController.openMoreInfo
    );
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

    currentWeatherController.processCurrentWeather(currentPeriod[0]);
    savedCurrentData = currentPeriod[0];

    weatherPeriodController.processWeatherPeriod(weatherPeriod[0]);
    savedPeriodData = weatherPeriod[0];
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
  },
  openMoreInfo: function () {
    //create a modal, the modal will contain all other information
    const modalSpace = document.querySelector(".modal-space");
    const modal = document.createElement("dialog");
    const moreInfoCard = currentWeatherController.createMoreInfoCard(
      savedCurrentData,
      modal
    );

    modalSpace.textContent = "";
    modalSpace.appendChild(modal);

    modal.show();
  },
  createMoreInfoCard: function (currentData, modal) {
    console.log(currentData);
    const conditionContainer = document.createElement("div");
    const feelsLikeContainer = document.createElement("div");
    const humidityContainer = document.createElement("div");
    const pricipContainer = document.createElement("div");
    const sunriseTime = document.createElement("div");
    const sunsetTime = document.createElement("div");
    const currentTemp = document.createElement("div");

    conditionContainer.textContent = currentData.conditions;
    //paused to change C to F method
    //feelsLikeContainer.textContent = currentData.feelsLike
    humidityContainer.textContent = currentData.humidity;
    pricipContainer.textContent = currentData.humidity;
    sunriseTime.textContent = currentData.sunrise;
    sunsetTime.textContent = currentData.sunset;
    currentTemp.textContent = currentData.temp;
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
