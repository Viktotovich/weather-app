//Pretend nothing else in this world exists, this DOES NOT HAVE TO KNOW ABOUT OUTSIDE FUNCTIONS. All this should do is process and return dates like a factory

import { format } from "date-fns";

const dateController = {
  processDate: function (date) {
    const processedDate = format(new Date(date), "dd-MMMM");
    return processedDate;
  },
  processHour: function (hour) {
    const today = this.getToday();
    console.log(hour);

    const [hours, minutes] = hour.split(":");
    today.setHours(hours, minutes);

    const processedHour = format(today, "h a");
    return processedHour;
  },
  getToday: function () {
    const today = new Date();
    return today;
  },
};

export { dateController };
