import apiKey from "./api-key";
import { dateController } from "./date-handler";

class WeatherDay {
  constructor(json, dayIndex) {
    this.conditions = json.conditions;
    this.dateTime = dateController.processDate(json.datetime);

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
    this.icon = json.icon;
    this.type = "General";
  }

  getHumidityLevel() {
    if (this.humidity < 50) {
      return "low";
    } else if (this.humidity >= 50 && this.humidity <= 70) {
      return "medium";
    } else {
      return "high";
    }
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

  getUserPreferredTemp(data, userTemp) {
    //i.e: dayTempMin+C
    return this[`${data}${userTemp}`];
  }
}

class CurrentWeather {
  constructor(json, address, description) {
    this.conditions = json.conditions;
    this.dateTimePeriod = dateController.processHour(json.datetime);

    this.feelsLikeF = `${json.feelslike}°F`;
    this.feelsLikeC = `${this.convertFtoC(json.feelslike)}°C`;

    this.humidity = json.humidity;
    this.pricip = this.getPrecip(json);
    this.snow = json.snow;

    this.sunrise = json.sunrise;
    this.sunset = json.sunset;

    this.tempF = `${json.temp}°F`;
    this.tempC = `${this.convertFtoC(json.temp)}°C`;

    this.icon = json.icon;

    this.address = this.capitalizeFirstLetter(address);
    this.description = description;
    this.type = "Current";
  }

  //for the icons
  getHumidityLevel() {
    if (this.humidity < 50) {
      return "low";
    } else if (this.humidity >= 50 && this.humidity <= 70) {
      return "medium";
    } else {
      return "high";
    }
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

  capitalizeFirstLetter(address) {
    const processedStr = address.toString();
    return processedStr.charAt(0).toUpperCase() + processedStr.slice(1);
  }

  getUserPreferredTemp(data, userTemp) {
    //i.e: dayTempMin+C
    return this[`${data}${userTemp}`];
  }
}

class HourPeriod {
  constructor(hour) {
    this.hoursObj = hour;
    this.exactHour = dateController.processHour(this.hoursObj.datetime);
    this.icon = hour.icon;
    this.tempF = `${hour.temp}°F`;
    this.tempC = `${this.convertFtoC(hour.temp)}°C`;
    this.precip = hour.precip;
    this.conditions = hour.conditions;
    this.humidity = hour.humidity;
  }

  getHumidityLevel() {
    if (this.humidity < 50) {
      return "low";
    } else if (this.humidity >= 50 && this.humidity <= 70) {
      return "medium";
    } else {
      return "high";
    }
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

  getUserPreferredTemp(data, userTemp) {
    return this[`${data}${userTemp}`];
  }
}

const requestsController = {
  requestLink:
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/",
  key: apiKey,
  createRequest: async function (location) {
    try {
      dataProcessor.resetWeatherData();

      const data = await fetch(
        `${this.requestLink}${location}/?key=${this.key}`
      );

      if (data.status >= 200 && data.status < 300) {
        const json = await data.json();

        //maybe return this - so it can be picked-up at receiveReply on DOM?
        const currentPeriod = await dataProcessor.processCurrent(json);
        const weatherPeriod = await dataProcessor.processDataPeriod(json);
        const hourPeriod = await dataProcessor.processHourPeriod(json);

        console.log(hourPeriod);

        return { currentPeriod, weatherPeriod, hourPeriod };
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
  weatherHours: [],
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
  processHourPeriod: function (json) {
    this.hourIndex *= 0;
    json.days[0].hours.forEach((hour) => {
      console.log(hour);
      let hourPeriodObj = new HourPeriod(hour);
      this.weatherHours.push(hourPeriodObj);
    });
    return this.weatherHours;
  },
  resetWeatherData: function () {
    dataProcessor.weatherPeriod = [];
    dataProcessor.currentPeriod = [];
    dataProcessor.weatherHours = [];
  },
};

export { requestsController, dataProcessor };
