<template>
  <div :style="{ top: position + 'px' }"></div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useTimetableStore } from "../stores/timetableInfo.js";

export default {
  setup() {
    const { startTime, timeTemplate } = storeToRefs(useTimetableStore());
    return { startTime, timeTemplate };
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
        ?.querySelectorAll("tr:not(.headerRow)");
    },
    getTableDimentions() {
      const rowElements = this.getRowElements();
      if (!rowElements) return;

      const top = this.getAbsoluteY(rowElements[0], false);
      const height =
        this.getAbsoluteY(rowElements[rowElements.length - 1], true) - top;

      return { top, height };
    },
  },
  computed: {
    position() {
      const minutesNow = this.time.getMinutes();
      const minutesMin = this.startTime.getMinutes();
      const minutesMax =
        minutesMin + this.timeTemplate.reduce((acc, cur) => acc + cur, 0);

      let percentDone = -1;
      if (minutesNow <= minutesMax && minutesNow >= minutesMin) {
        percentDone = (minutesMax - minutesMin) / (minutesNow - minutesMin);
      }

      const tableDimentions = this.getTableDimentions();
      if (!tableDimentions || percentDone === -1) {
        return -100;
      }

      return tableDimentions.height / percentDone + tableDimentions.top;
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
