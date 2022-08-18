<template>
  <div class="appContainer">
    <Header :time="currentTime" :date="currentDate" />

    <Notification v-if="errors.length !== 0" />

    <template v-if="!hasCriticalErrors">
      <Timetable :time="currentTime" :day="currentDay" />
      <AdditionalInfo v-if="isEditing" />
    </template>
    <CreateNew v-else />
  </div>
</template>

<script>
import Time from "./utils/Time.js";

import Header from "./components/Header.vue";
import Timetable from "./components/Timetable.vue";
import AdditionalInfo from "./components/AdditionalInfo.vue";
import Notification from "./components/Notification.vue";
import CreateNew from "./components/CreateNew.vue";

import { storeToRefs } from "pinia";
import { useTimetableStore } from "./stores/timetableInfo.js";

export default {
  setup() {
    const timetable = useTimetableStore();
    const { errors, isReady, isEditing } = storeToRefs(timetable);

    timetable.tryDecodeTimetable();

    return { errors, isReady, isEditing };
  },
  data() {
    return {
      interval: null,

      currentTime: new Time(),
      currentDay: 0,
      currentDate: "",
    };
  },
  mounted() {
    this.updateTime();
    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);
    this.isReady = true;
  },
  destroyed() {
    this.isReady = false;
    clearInterval(this.interval);
  },
  computed: {
    hasCriticalErrors() {
      return this.errors.some((error) => error.critical);
    },
  },
  methods: {
    updateTime() {
      const url = new URL(window.location.href);
      const date = new Date();

      const dayOverride = url.searchParams.get("do");
      const timeOverride = url.searchParams.get("to");

      if (dayOverride) {
        this.currentDay = parseInt(dayOverride);
      } else {
        this.currentDay = date.getDay() - 1;
      }

      if (timeOverride) {
        this.currentTime = new Time(timeOverride);
      } else {
        this.currentTime = new Time();
      }

      this.currentDate = date.toLocaleDateString("de-DE");
    },
  },
  components: {
    Header,
    Timetable,
    AdditionalInfo,
    Notification,
    CreateNew,
  },
};
</script>

<style lang="scss">
@import "./assets/base.scss";

.appContainer {
  display: flex;
  min-width: 55rem;
  width: var(--width);
  margin: 2rem auto 8rem;
  flex-direction: column;
  align-items: center;
}
</style>
