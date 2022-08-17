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

    <URLInstruction v-if="instructionOpen" @close="instructionOpen = false" />
  </div>
</template>

<script>
import URLInstruction from "./URLInstruction.vue";
import EditAction from "./HeaderActions/Edit.vue";
import ThemeAction from "./HeaderActions/Theme.vue";

import { storeToRefs } from "pinia";
import { useTimetableStore } from "../stores/timetableInfo.js";

export default {
  setup() {
    const { errors, isEditing, title } = storeToRefs(useTimetableStore());
    return { errors, isEditing, title };
  },
  data() {
    return {
      instructionOpen: false,
    };
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
    URLInstruction,
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
}
</style>
