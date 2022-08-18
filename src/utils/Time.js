export default class Time {
  constructor(timeString) {
    if (!timeString) {
      const date = new Date();
      this.timeString =
        date.getHours() + ":" + date.getMinutes().toString().padStart(2, "0");

      return;
    }

    this.timeString = timeString;
  }

  getMinutes() {
    const timeComponents = this.timeString.split(":");
    const hrs = parseInt(timeComponents[0]);
    const min = parseInt(timeComponents[1]);

    return hrs * 60 + min;
  }

  addMinutes(minutes) {
    const timeComponents = this.timeString.split(":");
    const hrs = parseInt(timeComponents[0]);
    const min = parseInt(timeComponents[1]);

    const minNew = (min + minutes) % 60;
    const hrsNew = hrs + Math.floor((min + minutes) / 60);

    return new Time(`${hrsNew}:${minNew.toString().padStart(2, "0")}`);
  }

  toString() {
    return this.timeString;
  }

  toPaddedString() {
    return this.timeString.padStart(5, "0");
  }
}
