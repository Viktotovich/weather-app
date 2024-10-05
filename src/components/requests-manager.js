import apiKey from "./api-key";

//dont forget F - C toggler LMAO

class WeatherDay {
  constructor(json, dayIndex) {
    //must be json.days[index] to work correctly
    this.conditions = json.conditions;
    this.dateTime = json.datetime;

    this.feelsLikeMaxTempF = `${json.feelslikemax}°F`;
    this.feelsLikeMaxTempC = `${this.convertFtoC(json.feelslikemax)}°C`;

    this.feelsLikeMinTempF = `${json.feelslikemin}°F`;
    this.feelsLikeMinTempC = `${this.convertFtoC(json.feelslikemin)}°C`;

    this.humidity = json.humidity;

    this.precip = this.getPrecip(json);
    this.snow = json.snow;

    this.dayTempF = `${json.temp}°F`;
    this.dayTempC = `${this.convertFtoC(json.temp)}°C`;

    this.dayTempMaxF = `${json.tempmax}°F`;
    this.dayTempMaxC = `${this.convertFtoC(json.tempmax)}°C`;

    this.dayTempMinF = `${json.tempmin}°F`;
    this.dayTempMinC = `${this.convertFtoC(json.tempmin)}°C`;

    this.sunrise = json.sunrise;
    this.sunset = json.sunset;

    this.weatherHours = json.hours;
    this.dayIndex = dayIndex;
  }

  convertFtoC(tempInF) {
    const tempInC = (tempInF - 32) * (5 / 9);
    return parseFloat(tempInC).toFixed(1);
  }

  getHours() {
    return this.weatherHours;
  }

  getPrecip(json) {
    if (json.precip === null) {
      return 0;
    } else {
      return json.precip;
    }
  }
}

class CurrentWeather {
  constructor(json, address, description) {
    this.conditions = json.conditions;
    this.dateTimePeriod = json.datetime;

    this.feelsLikeF = `${json.feelslike}°F`;
    this.feelsLikeC = `${this.convertFtoC(json.feelslike)}°C`;

    this.humidity = json.humidity;
    this.pricip = this.getPrecip(json);
    this.snow = json.snow;

    this.sunrise = json.sunrise;
    this.sunset = json.sunset;

    this.tempF = `${json.temp}°F`;
    this.tempC = `${this.convertFtoC(json.temp)}°C`;

    this.address = address;
    this.description = description;
  }

  convertFtoC(tempInF) {
    const tempInC = (tempInF - 32) * (5 / 9);
    return parseFloat(tempInC).toFixed(1);
  }

  getPrecip(json) {
    if (json.precip === null) {
      return 0;
    } else {
      return json.precip;
    }
  }
}

const requestsController = {
  requestLink:
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/",
  key: apiKey,
  createRequest: async function (location) {
    try {
      dataProcessor.resetWeatherPeriod();

      const data = await fetch(
        `${this.requestLink}${location}/?key=${this.key}`
      );

      if (data.status >= 200 && data.status < 300) {
        const json = await data.json();

        //maybe return this - so it can be picked-up at receiveReply on DOM?
        const currentPeriod = await dataProcessor.processCurrent(json);
        const weatherPeriod = await dataProcessor.processDataPeriod(json);

        return { currentPeriod, weatherPeriod };
      } else {
        throw new Error(
          `The request was rejected! HTTP Status: ${data.status}`
        );
      }
    } catch (err) {
      console.error(`${err.name}: ${err} at ${err.stack}`);
    }
  },
};

const dataProcessor = {
  //aka - weatherDay
  weatherPeriod: [],
  currentPeriod: [],
  dayIndex: 0,
  processCurrent: function (json) {
    const currentConditionsObj = new CurrentWeather(
      json.currentConditions,
      json.address,
      json.description
    );

    this.currentPeriod.push(currentConditionsObj);
    return this.currentPeriod;
  },
  processDataPeriod: function (json) {
    this.dayIndex *= 0;
    json.days.forEach((day) => {
      let dayObj = new WeatherDay(day, this.dayIndex);
      this.dayIndex += 1;

      this.weatherPeriod.push(dayObj);
    });
    return this.weatherPeriod;
  },
  resetWeatherPeriod: function () {
    dataProcessor.weatherPeriod = [];
  },
};

export { requestsController, dataProcessor };
