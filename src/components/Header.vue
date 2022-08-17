<template>
  <div class="header">
    <span>{{ date }}</span>

    <div v-if="!hasCriticalErrors" class="actionContainer">
      <span v-if="!isEditing">{{ title }}</span>
      <input v-else v-model="title" />

      <EditAction />
      <ThemeAction />
    </div>

    <span>{{ time }}</span>
  </div>
</template>

<script>
import EditAction from "./HeaderActions/Edit.vue";
import ThemeAction from "./HeaderActions/Theme.vue";

import { storeToRefs } from "pinia";
import { useTimetableStore } from "../stores/timetableInfo.js";

export default {
  setup() {
    const { errors, isEditing, title } = storeToRefs(useTimetableStore());
    return { errors, isEditing, title };
  },
  props: {
    time: {
      type: Object,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  computed: {
    hasCriticalErrors() {
      return this.errors.some((error) => error.critical);
    },
  },
  components: {
    EditAction,
    ThemeAction,
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  width: 100%;
  padding: 0.15rem;
  font-size: xx-large;
  border-radius: 0.2rem;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-background-soft);
  user-select: none;
}

.actionContainer {
  display: flex;
  align-items: center;
  column-gap: 0.5rem;

  & > *:first-child {
    margin-right: 1rem;
  }
}
</style>
