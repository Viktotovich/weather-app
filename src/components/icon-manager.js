/* eslint-disable */
//I am aware that the API has it's own icons, I just want to do something different

import snowIcon from "./icons/snow.png";
import rainIcon from "./icons/rain.png";
import fogIcon from "./icons/fog.png";
import windIcon from "./icons/wind.png";
import cloudyIcon from "./icons/wind.png";
import partlyCloudyDay from "./icons/partly-cloudy-day.png";
import partlyCloudyNight from "./icons/partly-cloudy-night.png";
import clearDayIcon from "./icons/clear-day.png";
import clearNightIcon from "./icons/clear-night.png";
import thunderRainIcon from "./icons/thunder-rain.png";
import showersNightIcon from "./icons/showers-night.png";
import hazyDayIcon from "./icons/hazy-day.png";
import showersDayIcon from "./icons/showers-day.png";
import sleetIcon from "./icons/sleet.png";
import highHumidityIcon from "./icons/high-humidity.png";
import blizzardIcon from "./icons/blizzard.png";
import hailIcon from "./icons/hail.png";
import dustStormDayIcon from "./icons/dust-storm-day.png";
import tornadoAlertIcon from "./icons/tornado-alert.png";
import earthquakeAlertIcon from "./icons/earthquare-alert.png";

class WeatherIcon {
  constructor(media) {
    this.media = media;
  }

  getIcon() {
    const processedIcon = new Image();
    processedIcon.src = this.media;
    return processedIcon;
  }
}

const weatherIcons = [];

function iconManager() {
  //Append all to the arr
}

iconManager();
