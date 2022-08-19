<template>
  <div class="container">
    <div v-for="alert in noDuplicates" class="notification">
      <InfoIcon class="infoIcon" />

      <span class="message">{{ alert.message }}</span>

      <button
        v-if="!alert.critical"
        class="icon"
        @click="removeError(alert.id)"
      >
        <CloseIcon />
      </button>
    </div>
  </div>
</template>

<script>
import InfoIcon from "../icons/Info.vue";
import CloseIcon from "../icons/Close.vue";

import { storeToRefs } from "pinia";
import { useTimetableStore } from "../stores/timetableInfo.js";

export default {
  setup() {
    const { alerts } = storeToRefs(useTimetableStore());
    return { alerts };
  },
  computed: {
    noDuplicates() {
      return this.alerts.filter(
        (alert, index, self) =>
          self.findIndex((alert_) => alert_.id === alert.id) === index,
      );
    },
  },
  methods: {
    removeError(id) {
      this.alerts = this.alerts.filter((alert) => alert.id !== id);
    },
  },
  components: {
    InfoIcon,
    CloseIcon,
  },
};
</script>

<style lang="scss" scoped>
button {
  margin-left: 1rem;
}

.container {
  width: 100%;
  margin: 1rem 0 2rem;
}

.notification {
  display: flex;
  width: 100%;
  margin-top: 1rem;
  padding: 0.25rem 0;
  justify-content: left;
  align-items: center;
  font-size: x-large;
  border-radius: 0.2rem;
  background-color: var(--color-background-soft);

  & > *:not(.message) {
    margin: 0 0.75rem;
  }
}

.infoIcon {
  color: var(--color-notification);
}

.message {
  flex-grow: 1;
}
</style>
