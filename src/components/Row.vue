<template>
  <tr :style="{ height: height }">
    <td v-if="isEditing">
      <input v-model="timeTemplate[rowIndex]" type="number" />
    </td>
    <td>
      <input
        v-if="isEditing && rowIndex === 0"
        :value="startTimeString"
        @input="changeStartTime"
        type="time"
      />
      <span v-else>{{ timeLabel[0] }}</span>
      <span> - {{ timeLabel[1] }}</span>

      <span v-if="!isEditing" class="rowLabel">{{ rowLabel }}</span>
      <button
        v-else
        :class="{ faded: rowLabel === '' }"
        class="rowLabel"
        @click="toggleRowLabel"
      >
        {{ rowLabel || "0" }}
      </button>
    </td>
    <Cell
      v-for="(n, index) in tableContent[rowIndex].length"
      :rowIndex="rowIndex"
      :cellIndex="index"
    />
  </tr>
</template>

<script>
import Cell from "./Cell.vue";

import { storeToRefs } from "pinia";
import { useTimetableStore } from "../stores/timetableInfo.js";

export default {
  setup() {
    const { isEditing, tableContent, timeTemplate, startTime, rowLabels } =
      storeToRefs(useTimetableStore());

    return {
      isEditing,
      tableContent,
      timeTemplate,
      startTime,
      rowLabels,
    };
  },
  props: {
    rowIndex: {
      type: Number,
      required: true,
    },
  },
  computed: {
    duration() {
      return this.timeTemplate[this.rowIndex];
    },
    timeLabel() {
      const elapsedSince = this.timeTemplate
        .slice(0, this.rowIndex)
        .reduce((acc, cur) => acc + Number(cur), 0);

      const lessonStartTime = this.startTime.addMinutes(elapsedSince);
      const lessonEndTime = this.startTime.addMinutes(
        elapsedSince + Number(this.duration),
      );
      return [lessonStartTime, lessonEndTime];
    },
    rowLabel() {
      const skippedAlready = this.rowLabels
        .slice(0, this.rowIndex)
        .reduce((acc, cur) => acc + (cur ? 1 : 0), 0);

      return this.rowLabels[this.rowIndex]
        ? ""
        : this.rowIndex + 1 - skippedAlready;
    },
    startTimeString() {
      return this.startTime.toPaddedString();
    },
    height() {
      return (1.5 * this.duration) / 15 + "em";
    },
  },
  methods: {
    toggleRowLabel() {
      this.rowLabels[this.rowIndex] = !this.rowLabels[this.rowIndex];
    },
    changeStartTime(event) {
      this.startTime.timeString = event.target.value;
    },
  },
  components: {
    Cell,
  },
};
</script>

<style lang="scss" scoped>
input[type="number"] {
  width: 3em;
}

td {
  position: relative;
}

tr {
  vertical-align: top;

  &:not(:nth-child(2)) > td {
    border-top: thin solid black;
  }
}

.rowLabel {
  position: absolute;
  top: 50%;
  right: 0.2em;
  font-size: xx-large;
  transform: translateY(-50%);

  &.faded {
    color: var(--color-border);
  }
}
</style>
