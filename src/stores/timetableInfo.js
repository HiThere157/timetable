import Time from "../utils/Time.js";

import { defineStore } from "pinia";

const delimiter1 = "$";
const delimiter2 = "§";
const delimiter3 = "%";

export const useTimetableStore = defineStore("timetableStore", {
  state() {
    return {
      alerts: [],
      isEditing: false,

      title: "",
      timeTemplate: [],
      tableContent: [],
      rowLabels: [],
      startTime: new Time("0:00"),
      colors: {},
      teachers: {},
    };
  },
  actions: {
    transpose(matrix) {
      const matrixLengths = matrix.map((r) => r.length);
      return Object.keys(
        matrix[matrixLengths.indexOf(Math.max(...matrixLengths))],
      ).map((c) => matrix.map((r) => r[c]));
    },
    trimArray(array) {
      for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] === "" || array[i] === undefined) {
          array.splice(i, 1);
        } else {
          break;
        }
      }
      return array;
    },
    filterReserved(string, errorObject = {}) {
      if (!string) return "";

      const newString = string.replace(/[$§%]/g, "");

      if (newString !== string) {
        errorObject.hasReserved = true;
      }

      return newString;
    },
    tryDecodeTimetable() {
      try {
        this.decodeTimetable();
      } catch (error) {
        this.alerts.push({
          id: "decodeError",
          critical: true,
          message:
            "Invalid or Old Timetable Format. (I probably updated the decoder)",
        });
        console.error(error);
      }
    },
    decodeTimetable() {
      const url = new URL(window.location.href);
      const timetable = url.searchParams.get("t") ?? "Template";
      const encoded = window.atob(
        import.meta.env["VITE_T_" + timetable] ?? timetable,
      );

      const regex =
        /([A-Z0-9:,\. -\_!]+)\$([0-9§]+)\$([A-Z0-9:%,§\. -\_!]+)\$([01]+)\$([0-9]+:[0-9]+)(\$([A-Z0-9%,§\. -\_!]+))?/i;
      if (!regex.test(encoded)) {
        throw new Error("Invalid timetable");
      }

      const encodedComponents = encoded.split(delimiter1);

      // Timetable Title
      this.title = encodedComponents[0];

      // Lesson Durations
      this.timeTemplate = encodedComponents[1]
        .split(delimiter2)
        .map((time) => parseInt(time));

      // Table Content
      this.tableContent = this.transpose(
        encodedComponents[2]
          .split(delimiter3)
          .map((day) => day.split(delimiter2)),
      );

      // Decoded Lesson Labels
      this.rowLabels = encodedComponents[3].split("").map((s) => s == "1");

      // Background Colors and Teacher Info
      if (encodedComponents[5]) {
        encodedComponents[5]
          .split(delimiter2)
          .map((param) => param.split(delimiter3))
          .forEach((info) => {
            this.colors[info[0]] = info[1];
            this.teachers[info[0]] = info[2];
          });
      }

      // Calculate lesson start and end times using duration and end time of previous lesson
      this.startTime = new Time(encodedComponents[4]);
    },
    filterTimetable() {
      const errorObject = {};
      // Filter Lesson Names
      this.tableContent = this.tableContent.map((day) => {
        return day.map((lesson) => {
          return this.filterReserved(lesson, errorObject);
        });
      });

      // Filter Title
      this.title = this.filterReserved(this.title, errorObject);

      // Filter Teacher Names
      this.teachers = Object.fromEntries(
        Object.entries(this.teachers).map(([key, value]) => {
          return [
            this.filterReserved(key, errorObject),
            this.filterReserved(value, errorObject),
          ];
        }),
      );

      // Filter Background Colors
      this.colors = Object.fromEntries(
        Object.entries(this.colors).map(([key, value]) => {
          return [this.filterReserved(key, errorObject), value];
        }),
      );

      if (errorObject.hasReserved) {
        this.alerts.push({
          id: "reservedCharacters",
          critical: false,
          message: `Some reserved characters (${
            delimiter1 + delimiter2 + delimiter3
          }) have been removed.`,
        });
      }

      // Remove unnecessary Rows
      for (let i = this.tableContent.length - 1; i >= 0; i--) {
        if (this.tableContent[i].join("") === "") {
          this.tableContent.pop();
          this.timeTemplate.pop();
          this.rowLabels = this.rowLabels.slice(0, this.tableContent.length);
        } else {
          break;
        }
      }
      if (this.tableContent.length === 0) {
        this.tableContent = [["Placeholder", "", "", "", ""]];
        this.timeTemplate = [45];
        this.rowLabels = [false];
      }

      // Remove possible undefined values in rowLabels
      for (let i = 0; i < this.rowLabels.length; i++) {
        if (this.rowLabels[i] === undefined) {
          this.rowLabels[i] = false;
        }
      }

      // Check for minimum Duration
      let hasMinimumDuration = true;
      this.timeTemplate = this.timeTemplate.map((duration) => {
        if (duration < 15) {
          hasMinimumDuration = false;
          return 15;
        }
        return duration;
      });

      if (!hasMinimumDuration) {
        this.alerts.push({
          id: "minimumDuration",
          critical: false,
          message:
            "Minimum Duration is 15 minutes. Affected Lessons have been corrected.",
        });
      }
    },
    encodeTimetable() {
      const encoded = [
        this.title,

        this.timeTemplate.join(delimiter2),

        this.transpose(this.tableContent)
          .map((day) => this.trimArray(day).join(delimiter2))
          .join(delimiter3),

        this.rowLabels.map((s) => (s ? "1" : "0")).join(""),

        this.startTime.toString(),

        Object.keys(this.colors)
          .map(
            (key) =>
              `${key}${delimiter3}${this.colors[key]}` +
              (this.teachers[key] ? `${delimiter3}${this.teachers[key]}` : ""),
          )
          .join(delimiter2),
      ].join(delimiter1);

      window.history.pushState({}, "", `?t=${window.btoa(encoded)}`);
    },
  },
});
