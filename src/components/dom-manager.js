/* eslint-disable */
import { requestsController } from "./requests-manager";
import capitals from "./json/capitals.json";
import { iconFinder } from "./icon-manager";
import { sub } from "date-fns";

//To avoid Dom troubles, it's best to save the data here itself
let preferredTemparature = "C";
let savedCurrentData = [];
let savedPeriodData = [];
let savedHourlyData = [];
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
  disableSearch: function () {
    const submitSearchButton = document.querySelector("#submit-search");
    submitSearchButton.disabled = true;

    //goes in queue, waits till fetch gets the data - and only then the 3 seconds pass (I think)
    setTimeout(() => {
      submitSearchButton.disabled = false;
    }, 3000);
  },
  searchWeather: function (e) {
    e.preventDefault();
    const searchInput = document.querySelector("#search");
    const searchValue = searchInput.value;

    domController.disableSearch();

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
  receiveReply: function ({ currentPeriod, weatherPeriod, hourPeriod }) {
    console.log(currentPeriod, weatherPeriod, hourPeriod);

    savedHourlyData = hourPeriod;
    weatherHourController.processHours(savedHourlyData);

    savedCurrentData = currentPeriod[0];
    currentWeatherController.processCurrentWeather(currentPeriod[0]);

    savedPeriodData = weatherPeriod;
    weatherPeriodController.processWeatherPeriod(weatherPeriod);
  },
  fillSuggestions: function (suggestionContainer) {
    Object.values(capitals).forEach((capital) => {
      let capitalContainer = document.createElement("option");
      capitalContainer.setAttribute("value", capital);

      suggestionContainer.appendChild(capitalContainer);
    });
  },
  changePreferredTemp: function () {
    const fUnit = document.querySelector("#F");
    const cUnit = document.querySelector("#C");
    //if this isn't done, the milisecond while things are loading allows the users to blow everything up by switching F/C
    const isAvailable = domController.failSafeTest();

    if (preferredTemparature === "C") {
      preferredTemparature = "F";
      cUnit.removeAttribute("class");
      fUnit.setAttribute("class", "selectedTemp");
      if (isAvailable === true) {
        domController.resetTempDisplays();
      }
    } else {
      preferredTemparature = "C";
      fUnit.removeAttribute("class");
      cUnit.setAttribute("class", "selectedTemp");
      if (isAvailable === true) {
        domController.resetTempDisplays();
      }
    }
  },
  failSafeTest: function () {
    const currentTemp = document.querySelector(".current-temp");
    if (currentTemp.firstChild === null) {
      return false;
    } else {
      return true;
    }
  },
  resetTempDisplays: function () {
    weatherHourController.processHours(savedHourlyData);
    currentWeatherController.processCurrentWeather(savedCurrentData);
    weatherPeriodController.processWeatherPeriod(savedPeriodData);
  },
};

const currentWeatherController = {
  processCurrentWeather: function (data) {
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
    currentTemp.textContent = data.getUserPreferredTemp(
      "temp",
      preferredTemparature
    );
    cityName.textContent = data.address;
    weatherDescription.textContent = data.description;

    currentWeatherIcon.appendChild(weatherIcon);
  },
  openMoreInfo: function () {
    const isReady = domController.failSafeTest();
    if (isReady === true) {
      const modalSpace = document.querySelector(".modal-space");
      const modal = document.createElement("dialog");
      currentWeatherController.createMoreInfoCard(savedCurrentData, modal);

      modalSpace.textContent = "";
      modalSpace.appendChild(modal);

      modal.showModal();
    }
  },
  closeModal: function () {
    const modalSpace = document.querySelector(".modal-space");

    modalSpace.textContent = "";
  },
  createMoreInfoCard: function (currentData, modal) {
    const closeModalButton = document.createElement("div");

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

    closeModalButton.addEventListener(
      "click",
      currentWeatherController.closeModal
    );

    closeModalButton.textContent = "x";
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

    modal.classList.add("additional-information");
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
    closeModalButton.classList.add("close-modal-button");

    modal.appendChild(closeModalButton);
    modal.appendChild(sunStatusContainer);
    modal.appendChild(tempContainer);
    modal.appendChild(humidityContainer);
    modal.appendChild(conditionContainer);
    modal.appendChild(pricip);
    modal.appendChild(creditsContainer);
  },
};

const weatherPeriodController = {
  //this will have to process the current weather data's hourly cards - make hourly cards up to down
  cardIndex: 0,
  processWeatherPeriod: function (weatherPeriodData) {
    const weatherCardContainer = document.querySelector(
      ".weather-card-container"
    );

    weatherCardContainer.textContent = "";
    this.cardIndex *= 0;

    weatherPeriodData.forEach((obj) => {
      this.createCard(obj, weatherCardContainer, this.cardIndex);
      this.cardIndex += 1;
    });
  },

  createCard: function (data, location, cardIndex) {
    const weatherCard = document.createElement("div");
    const temp = document.createElement("div");

    const cardFooter = document.createElement("div");
    const conditionContainer = document.createElement("div");
    const status = document.createElement("div");
    const date = document.createElement("div");
    const moreInfo = document.createElement("div");

    weatherCard.style.backgroundImage = `url(${iconFinder.processBackgroundIcon(
      data.icon
    )})`;

    temp.textContent = data.getUserPreferredTemp(
      "dayTemp",
      preferredTemparature
    );
    status.textContent = data.conditions;
    date.textContent = data.dateTime;
    moreInfo.textContent = "See more info...";

    location.appendChild(weatherCard);
    weatherCard.appendChild(temp);
    weatherCard.appendChild(cardFooter);

    cardFooter.appendChild(conditionContainer);
    conditionContainer.appendChild(status);
    conditionContainer.appendChild(date);
    cardFooter.appendChild(moreInfo);

    weatherCard.classList.add("weather-card");
    temp.classList.add("temp-on-weather-card");
    cardFooter.classList.add("card-footer");
    conditionContainer.classList.add("condition-container");
    status.classList.add("status-on-weather-card");
    date.classList.add("date");
    moreInfo.classList.add("more-info");
    moreInfo.setAttribute("id", `card-index:${cardIndex}`);

    moreInfo.addEventListener("click", weatherPeriodController.openMoreInfo);
  },
  openMoreInfo: function (e) {
    const modalSpace = document.querySelector(".modal-space");
    const modal = document.createElement("dialog");
    const cardIndex = weatherPeriodController.getCardIndex(e);
    const cardData = savedPeriodData[cardIndex];

    //Keeping things DRY
    currentWeatherController.createMoreInfoCard(cardData, modal);

    modalSpace.textContent = "";
    modalSpace.appendChild(modal);

    modal.showModal();
  },
  getCardIndex: function (e) {
    const idName = e.target.getAttribute("id");
    const cardIndex = idName.slice(11);
    return cardIndex;
  },
};

const weatherHourController = {
  weatherHourContainer: document.querySelector(".current-hourly-breakdown"),
  processHours: function (json) {
    this.weatherHourContainer.textContent = "";
    json.forEach((hour) => {
      this.createHourCard(hour, this.weatherHourContainer);
    });
  },
  createHourCard: function (hourObj, weatherHoursContainer) {
    const hourContainer = document.createElement("div");
    const iconContainer = document.createElement("div");
    const temp = document.createElement("span");

    const additionalInfo = document.createElement("div");
    const hourAndPrecip = document.createElement("div");
    const hour = document.createElement("div");
    const precipitation = document.createElement("div");

    const conditionsContainer = document.createElement("div");
    const conditions = document.createElement("div");
    const humidity = document.createElement("div");

    temp.textContent = hourObj.getUserPreferredTemp(
      "temp",
      preferredTemparature
    );

    hour.textContent = hourObj.exactHour;
    precipitation.textContent = `Precipitation: ${hourObj.getPrecip(hourObj)}`;
    conditions.textContent = hourObj.conditions;
    humidity.textContent = `Humidity: ${hourObj.humidity}%`;

    iconContainer.style.backgroundImage = `url(${iconFinder.processBackgroundIcon(
      hourObj.icon
    )})`;

    /*
    [icon       |                     ]
    [Temperature|    Hour      Precip ]
    [icon       | conditions  humidity]
    */

    weatherHoursContainer.appendChild(hourContainer);
    hourContainer.appendChild(iconContainer);
    hourContainer.appendChild(additionalInfo);
    iconContainer.appendChild(temp);

    additionalInfo.appendChild(hourAndPrecip);
    additionalInfo.appendChild(conditionsContainer);

    hourAndPrecip.appendChild(hour);
    hourAndPrecip.appendChild(precipitation);

    conditionsContainer.appendChild(conditions);
    conditionsContainer.appendChild(humidity);

    weatherHoursContainer.classList.add("weather-hours-container");
    hourContainer.classList.add("hour-container");
    iconContainer.classList.add("icon-container");
    additionalInfo.classList.add("additional-info-container");
    hourAndPrecip.classList.add("hour-and-precip-container");
    hour.classList.add("hour");
    precipitation.classList.add("precipitation-on-card");
    conditions.classList.add("conditions-on-card");
    humidity.classList.add("humidity-on-card");
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

*/
