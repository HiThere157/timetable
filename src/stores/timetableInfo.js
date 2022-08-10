import Time from "../utils/Time.js";

import { defineStore } from "pinia";

export const useTimetableStore = defineStore("timetableStore", {
  state() {
    return {
      errors: [],
      isReady: false,
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
      return Object.keys(matrix[0]).map((c) => matrix.map((r) => r[c]));
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

      const newString = string.replace(/[,;$]/g, "");

      if (newString !== string) {
        errorObject.hasReserved = true;
      }

      return newString;
    },
    tryDecodeTimetable() {
      try {
        this.decodeTimetable();
      } catch (error) {
        this.errors.push({
          critical: true,
          message: "Invalid Timetable Format",
        });
        console.error(error);
      }
    },
    decodeTimetable() {
      const url = new URL(window.location.href);
      const timetable = url.searchParams.get("t") ?? "Template";

      const timetables = {
        OF10S2:
          "T0YxMFMyJDQ1LDQ1LDQ1LDIwLDQ1LDQ1LDQ1LDQ1LDQ1LDQ1LDQ1JEVuZ2xpc2NoLElULVN5c3RlbWUsSVQtU3lzdGVtZSxQYXVzZSxJVC1UaGVvcmllLElULVRoZW9yaWUsTWl0dGFnc3BhdXNlLEFQLEFQLFBvbGl0aWssRXRoaWsvUmVsaTs7O0lULVN5c3RlbWUsSVQtU3lzdGVtZSxCd1AsUGF1c2UsQndQLElULVRoZW9yaWUsSVQtVGhlb3JpZTskMDAwMSQ3OjUwJFBhdXNlOjYwLE1pdHRhZ3NwYXVzZTo2MCxFbmdsaXNjaDowOkZyLiBLbGluZ3Nwb3IsSVQtU3lzdGVtZToxODA6SHIuIEVsdGVyLEFQOjEzMDpGci4gSGlwcGVsaSxQb2xpdGlrOjIwMDpIci4gQmVyYmVyaWNoLEV0aGlrL1JlbGk6MzAwOkZyLiBCZWNrbWFubitGci4gSG9mZm1hbm4sQndQOjI0MDpIci4gR2VoZWViIChLTCksSVQtVGhlb3JpZToyNjA6SHIuIEdlaGVlYiAoS0wpK0hyLiBaaW1tZXJtYW5u",
        Template:
          "VGVtcGxhdGUkNDUsNDUsNDUsMjAsNDUsNDUsNDUsNDUsNDUsNDUsNDUkLCwsLCwsLCwsLFQ7Ozs7JDAwMDEkMDg6MDAk",
      };

      const encoded = window.atob(timetables[timetable] ?? timetable);

      const regex =
        /([A-Z0-9]+)\$([0-9,]+)\$([A-Z0-9,-\_]+)\$([01]+)\$([0-9]+:[0-9]+)(\$([A-Z0-9:,\. -\_]+))?/i;
      if (!regex.test(encoded)) {
        throw new Error("Invalid timetable");
      }

      const encodedComponents = encoded.split("$");

      // Timetable Title
      this.title = encodedComponents[0];

      // Lesson Durations
      this.timeTemplate = encodedComponents[1]
        .split(",")
        .map((time) => parseInt(time));

      // Table Content
      this.tableContent = this.transpose(
        encodedComponents[2].split(";").map((day) => day.split(",")),
      );

      // Decoded Lesson Labels
      this.rowLabels = encodedComponents[3].split("").map((s) => s == "1");

      // Background Colors and Teacher Info
      if (encodedComponents[5]) {
        encodedComponents[5]
          .split(",")
          .map((param) => param.split(":"))
          .forEach((info) => {
            this.colors[info[0]] = info[1];
            this.teachers[info[0]] = info[2];
          });
      }

      // Calculate lesson start and end times using duration and end time of previous lesson
      this.startTime = new Time(encodedComponents[4]);
    },
    encodeTimetable() {
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
        this.errors.push({
          critical: false,
          message: "Some reserved characters (,;$) have been removed.",
        });
      }

      // Remove unnecessary Rows
      for (let i = this.tableContent.length - 1; i >= 0; i--) {
        if (this.tableContent[i].join("") === "") {
          this.tableContent.pop();
          this.timeTemplate.pop();
        } else {
          break;
        }
      }
      if (this.tableContent.length === 0) {
        this.tableContent.push(["Placeholder", "", "", "", ""]);
        this.timeTemplate.push(45);
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
        this.errors.push({
          critical: false,
          message:
            "Minimum Duration is 15 minutes. Affected Lessons have been corrected.",
        });
      }

      const encoded = [
        this.title,

        this.timeTemplate.join(","),

        this.transpose(this.tableContent)
          .map((day) => this.trimArray(day).join(","))
          .join(";"),

        this.rowLabels.map((s) => (s ? "1" : "0")).join(""),

        this.startTime.toString(),

        Object.keys(this.colors).map(
          (key) =>
            `${key}:${this.colors[key]}` +
            (this.teachers[key] ? `:${this.teachers[key]}` : ""),
        ),
      ].join("$");

      window.history.pushState({}, "", `?t=${window.btoa(encoded)}`);
    },
  },
});
