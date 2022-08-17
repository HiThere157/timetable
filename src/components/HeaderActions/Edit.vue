<template>
  <URLInstruction v-if="instructionOpen" @close="instructionOpen = false" />

  <button class="icon" @click="toggleEdit">
    <EditIcon v-if="!isEditing" />
    <CloseIcon v-else />
  </button>
  <button v-if="isEditing" class="icon" @click="saveToUrl">
    <SaveIcon />
  </button>
</template>

<script>
import URLInstruction from "../URLInstruction.vue";
import EditIcon from "../../icons/Edit.vue";
import CloseIcon from "../../icons/Close.vue";
import SaveIcon from "../../icons/Save.vue";

import { storeToRefs } from "pinia";
import { useTimetableStore } from "../../stores/timetableInfo.js";

export default {
  setup() {
    const { isEditing } = storeToRefs(useTimetableStore());
    return { isEditing };
  },
  data() {
    return {
      instructionOpen: false,
    };
  },
  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },
    saveToUrl() {
      const timetable = useTimetableStore();
      timetable.encodeTimetable();

      this.isEditing = false;
      this.instructionOpen = true;
    },
  },
  components: {
    URLInstruction,
    EditIcon,
    CloseIcon,
    SaveIcon,
  },
};
</script>

<style></style>
