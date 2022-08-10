<template>
  <div :style="{ top: position + 'px' }"></div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useTimetableStore } from "../stores/timetableInfo.js";

export default {
  setup() {
    const { isReady, startTime, timeTemplate } = storeToRefs(
      useTimetableStore(),
    );
    return { isReady, startTime, timeTemplate };
  },
  props: {
    time: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getAbsoluteY(element, addOwnHeight) {
      let top = 0;
      if (addOwnHeight) {
        top = element.offsetHeight;
      }

      do {
        top += element.offsetTop || 0;
        element = element.offsetParent;
      } while (element);

      return top;
    },
    getRowElements() {
      return document
        .querySelector(".timetable-js")
        .querySelectorAll("tr:not(.headerRow)");
    },
  },
  computed: {
    tableTop() {
      return this.getAbsoluteY(this.getRowElements()[0], false);
    },
    tableHeight() {
      const rowElements = this.getRowElements();
      return (
        this.getAbsoluteY(rowElements[rowElements.length - 1], true) -
        this.tableTop
      );
    },
    position() {
      if (!this.isReady) return 0;

      const minutesNow = this.time.getMinutes();
      const minutesMin = this.startTime.getMinutes();
      const minutesMax =
        minutesMin + this.timeTemplate.reduce((acc, cur) => acc + cur, 0);

      let percentDone = -1;
      if (minutesNow <= minutesMax && minutesNow >= minutesMin) {
        percentDone = (minutesMax - minutesMin) / (minutesNow - minutesMin);
      }

      return percentDone === -1
        ? -100
        : this.tableHeight / percentDone + this.tableTop;
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  width: 100%;
  position: absolute;
  transition: 1s;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: calc((100% - var(--width)) / 2 - 2em);
    background-color: red;
    z-index: 200;
  }

  &::before {
    top: -0.2em;
    height: 0.6em;
    width: 0.6em;
  }

  &::after {
    height: 0.2em;
    width: calc(var(--width) + 4em);
  }
}
</style>
