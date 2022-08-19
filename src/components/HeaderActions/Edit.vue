<template>
  <URLInstruction v-if="instructionOpen" @close="instructionOpen = false" />

  <button v-if="!isEditing" class="icon" @click="toggleEdit">
    <EditIcon />
  </button>
  <button v-else class="icon" @click="toggleEdit">
    <SaveIcon />
  </button>
</template>

<script>
import URLInstruction from "../URLInstruction.vue";
import EditIcon from "../../icons/Edit.vue";
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

      // When exiting edit mode, filter for reserved Characters & empty rows
      if (!this.isEditing) {
        const timetable = useTimetableStore();
        timetable.filterTimetable();
        timetable.encodeTimetable();

        this.instructionOpen = true;
      }
    },
  },
  components: {
    URLInstruction,
    EditIcon,
    SaveIcon,
  },
};
</script>

<style></style>
