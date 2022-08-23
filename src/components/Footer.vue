<template>
  <div
    v-if="currentLesson.lesson"
    class="footer"
    :style="{
      '--color': color,
    }"
  >
    <div
      class="footerBar"
      :style="{
        width: lessonInfo.progress,
      }"
    ></div>
    <span>{{ lessonInfo.lessonStartTime }}</span>
    <span>{{
      `${currentLesson.lesson} - ${lessonInfo.remainingTime} min. remaining`
    }}</span>
    <span>{{ lessonInfo.lessonEndTime }}</span>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useTimetableStore } from "../stores/timetableInfo.js";

export default {
  setup() {
    const { startTime, tableContent, timeTemplate, colors } = storeToRefs(
      useTimetableStore(),
    );
    return { startTime, tableContent, timeTemplate, colors };
  },
  props: {
    time: {
      type: Object,
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
  },
  methods: {
    getLessonStart(index) {
      return this.timeTemplate
        .slice(0, index)
        .reduce((acc, cur) => acc + cur, 0);
    },
    getLessonIndex(minutes) {
      for (let i = 0; i < this.timeTemplate.length; i++) {
        const elapsedSince =
          this.startTime.getMinutes() + this.getLessonStart(i);

        if (
          elapsedSince <= minutes &&
          elapsedSince + this.timeTemplate[i] > minutes
        ) {
          return i;
        }
      }
      return -1;
    },
  },
  computed: {
    color() {
      return this.colors[this.currentLesson.lesson] ?? 0;
    },
    currentLesson() {
      const index = this.getLessonIndex(this.time.getMinutes());
      const lesson = this.tableContent[index]?.[this.day];

      return { lesson, index };
    },
    lessonInfo() {
      const { lesson, index } = this.currentLesson;

      if (!lesson) return {};

      // start with the current lesson start time, end time and duration
      let totalTime = this.timeTemplate[index];
      let lessonStartTime = this.startTime.addMinutes(
        this.getLessonStart(index),
      );
      let lessonEndTime = lessonStartTime.addMinutes(totalTime);

      // check for following lessons with the same name
      for (let i = index + 1; i < this.timeTemplate.length; i++) {
        const thisLesson = this.tableContent[i]?.[this.day];
        if (thisLesson != lesson) {
          break;
        }

        // set the new end time to the end time of the next lesson
        lessonEndTime = this.startTime.addMinutes(
          this.getLessonStart(i) + this.timeTemplate[i],
        );
        totalTime += this.timeTemplate[i];
      }

      // check for previous lessons with the same name
      for (let i = index - 1; i >= 0; i--) {
        const thisLesson = this.tableContent[i]?.[this.day];
        if (thisLesson != lesson) {
          break;
        }

        // set the new start time to the start time of the previous lesson
        lessonStartTime = this.startTime.addMinutes(this.getLessonStart(i));
        totalTime += this.timeTemplate[i];
      }

      const remainingTime = lessonEndTime.getMinutes() - this.time.getMinutes();
      const progress = (1 - remainingTime / totalTime) * 100 + "%";

      return {
        lessonStartTime,
        lessonEndTime,
        totalTime,
        remainingTime,
        progress,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  position: fixed;
  width: 100%;
  height: 3em;
  bottom: 0;
  background-color: var(--color-background-soft);
  align-items: center;
  justify-content: space-between;
  transition: transform 1s;
  z-index: 300;

  transform: translateY(0);

  & > span {
    font-size: xx-large;
    margin: 0 0.5em;
    z-index: 350;
  }

  ::selection {
    background-color: hsla(
      var(--color),
      100%,
      40%,
      calc(var(--default-opacity) * 3)
    );
  }
}

.footerBar {
  position: absolute;
  width: 0%;
  height: 100%;
  background-color: hsla(
    var(--color),
    100%,
    40%,
    calc(var(--default-opacity) * 2)
  );
  transition: width 3s;
}
</style>
