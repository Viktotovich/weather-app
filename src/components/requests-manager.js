import apiKey from "./api-key";

//dont forget F - C toggler LMAO

class WeatherDay {
  constructor(json, dayIndex) {
    //must be json.days[index] to work correctly
    this.conditions = json.conditions;
    this.dateTime = json.datetime;
    this.feelsLikeMaxTempF = json.feelslikemax;
    this.feelsLikeMinTempF = json.feelslikemin;
    this.humidity = json.humidity;

    this.precip = this.getPrecip(json);
    this.snow = json.snow;

    this.dayTempF = json.temp;
    this.dayTempC = this.convertFtoC(this.dayTempF);

    this.dayTempMaxF = json.tempmax;
    this.dayTempMaxC = this.convertFtoC(this.dayTempMaxF);

    this.dayTempMinF = json.tempmin;
    this.dayTempMinC = this.convertFtoC(this.dayTempMinF);

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
  constructor(json) {
    this.conditions = json.conditions;
    this.dateTimePeriod = json.datetime;

    this.feelsLikeF = json.feelslike;
    this.feelsLikeC = this.convertFtoC(this.feelsLikeF);

    this.humidity = json.humidity;
    this.pricip = this.getPrecip(json);
    this.snow = json.snow;

    this.sunrise = json.sunrise;
    this.sunset = json.sunset;
    this.tempF = json.temp;
    this.tempC = this.convertFtoC(this.tempF);
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

        dataProcessor.processCurrent(json);
        dataProcessor.processDataPeriod(json);
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
    const currentConditionsObj = new CurrentWeather(json.currentConditions);

    this.currentPeriod.push(currentConditionsObj);
    console.log(this.currentPeriod);
  },
  processDataPeriod: function (json) {
    this.dayIndex *= 0;
    json.days.forEach((day) => {
      let dayObj = new WeatherDay(day, this.dayIndex);
      this.dayIndex += 1;

      this.weatherPeriod.push(dayObj);
    });
    console.log(this.weatherPeriod);
  },
  resetWeatherPeriod: function () {
    dataProcessor.weatherPeriod = [];
  },
};

export { requestsController };
