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
    const { isEditing, alerts } = storeToRefs(useTimetableStore());
    return { isEditing, alerts };
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
      if (this.isEditing) return;
      const timetable = useTimetableStore();
      timetable.filterTimetable();

      this.alerts.push({
        id: "unsavedChanges",
        critical: false,
        message:
          "Unsaved changes will be lost after reloading the page. To save your changes, click the save button when editing.",
      });
    },
    saveToUrl() {
      const timetable = useTimetableStore();
      timetable.filterTimetable();
      timetable.encodeTimetable();

      this.isEditing = false;
      this.instructionOpen = true;

      this.alerts = this.alerts.filter(
        (alert) => alert.id !== "unsavedChanges",
      );
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
