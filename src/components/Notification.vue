<template>
  <div class="container">
    <div v-for="(error, index) in errors" class="notification">
      <InfoIcon />

      <span class="message">{{ error.message }}</span>

      <button v-if="!error.critical" class="icon" @click="removeError(index)">
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
    const { errors } = storeToRefs(useTimetableStore());
    return { errors };
  },
  methods: {
    removeError(index) {
      this.errors.splice(index, 1);
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
  height: 2.75rem;
  margin-top: 1rem;
  justify-content: left;
  align-items: center;
  font-size: x-large;
  border-radius: 0.2rem;
  background-color: var(--color-background-soft);
  color: var(--color-notification);

  & > *:not(.message) {
    margin: 0 0.75rem;
  }
}

.message {
  flex-grow: 1;
}
</style>
