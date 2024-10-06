/* eslint-disable */
import { dataProcessor, requestsController } from "./requests-manager";
import capitals from "./json/capitals.json";
import { iconFinder } from "./icon-manager";

//To avoid Dom troubles, it's best to save the data here itself
let preferredTemparature = "C";
let savedCurrentData = [];
let savedPeriodData = [];
let credits =
  "Special thanks to Virtual Crossing, and their API for allowing the project to exist! All images are created with Canva Pro.";

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

    currentWeatherIcon.textContent = "";
    localTime.textContent = data.dateTimePeriod;
    currentTemp.textContent = data.tempC;
    cityName.textContent = data.address;
    weatherDescription.textContent = data.description;

    currentWeatherIcon.appendChild(weatherIcon);
  },
  openMoreInfo: function () {
    const modalSpace = document.querySelector(".modal-space");
    const modal = document.createElement("dialog");
    currentWeatherController.createMoreInfoCard(savedCurrentData, modal);

    modalSpace.textContent = "";
    modalSpace.appendChild(modal);

    modal.showModal();
  },
  createMoreInfoCard: function (currentData, modal) {
    console.log(currentData);
    const conditionContainer = document.createElement("div");

    const humidityContainer = document.createElement("div");
    const humidity = document.createElement("div");
    const humidityIconContainer = document.createElement("div");

    const tempContainer = document.createElement("div");
    const currentTempContainer = document.createElement("div");
    const currentTemp = document.createElement("span");
    const currentTempText = document.createElement("span");
    const feelsLikeTempContainer = document.createElement("div");
    const feelsLike = document.createElement("span");
    const feelsLikeText = document.createElement("span");

    const sunStatusContainer = document.createElement("div");
    const sunriseContainer = document.createElement("div");
    const sunsetContainer = document.createElement("div");
    const sunriseTime = document.createElement("div");
    const sunriseIcon = document.createElement("div");
    const sunsetTime = document.createElement("div");
    const sunsetIcon = document.createElement("div");

    const pricip = document.createElement("div");
    const creditsContainer = document.createElement("div");

    conditionContainer.textContent = currentData.conditions;
    humidity.textContent = currentData.humidity;
    pricip.textContent = currentData.pricip;
    sunriseTime.textContent = currentData.sunrise;
    sunsetTime.textContent = currentData.sunset;
    creditsContainer.textContent = credits;

    feelsLike.textContent = currentData.getUserPreferredTemp(
      "feelsLike",
      preferredTemparature
    );
    feelsLikeText.textContent = "The temperature feels like:";

    currentTemp.textContent = currentData.getUserPreferredTemp(
      "temp",
      preferredTemparature
    );
    currentTempText.textContent = "Current Temperature:";

    sunStatusContainer.appendChild(sunriseContainer);
    sunriseContainer.appendChild(sunriseIcon);
    sunriseContainer.appendChild(sunriseTime);
    sunriseIcon.appendChild(iconFinder.processCondition("sunrise"));

    sunStatusContainer.appendChild(sunsetContainer);
    sunsetContainer.appendChild(sunsetIcon);
    sunsetContainer.appendChild(sunsetTime);
    sunsetIcon.appendChild(iconFinder.processCondition("sunset"));

    tempContainer.appendChild(currentTempContainer);
    currentTempContainer.appendChild(currentTempText);
    currentTempContainer.appendChild(currentTemp);

    tempContainer.appendChild(feelsLikeTempContainer);
    feelsLikeTempContainer.appendChild(feelsLikeText);
    feelsLikeTempContainer.appendChild(feelsLike);

    humidityContainer.appendChild(humidity);
    humidityContainer.appendChild(humidityIconContainer);
    //get the icon based on humidity level
    humidityIconContainer.appendChild(
      iconFinder.processHumidity(savedCurrentData)
    );

    modal.classList.add("current-data-additional-information");
    conditionContainer.classList.add("current-conditions-container");
    humidityContainer.classList.add("humidity-container");
    humidityIconContainer.classList.add("humidity-data-container");
    tempContainer.classList.add("temp-container");
    currentTempContainer.classList.add("current-temp-container");
    currentTemp.classList.add("current-temp");
    feelsLikeTempContainer.classList.add("feels-like-container");
    feelsLike.classList.add("feels-like");
    sunStatusContainer.classList.add("sun-status-container");
    sunriseContainer.classList.add("sunrise-container");
    sunsetContainer.classList.add("sunsetContainer");
    pricip.classList.add("current-pricip");
    creditsContainer.classList.add("credits-container");

    modal.appendChild(sunStatusContainer);
    modal.appendChild(tempContainer);
    modal.appendChild(humidityContainer);
    modal.appendChild(conditionContainer);
    modal.appendChild(pricip);
    modal.appendChild(creditsContainer);
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
