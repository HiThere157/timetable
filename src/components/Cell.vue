<template>
  <td
    :class="{ cell: name }"
    :style="{
      '--color': color,
      '--width': hideContent ? '0' : '8px',
      '--heightOffset': hideContent ? '10px' : '0px',
    }"
  >
    <div v-if="!hideContent && !isEditing">
      <span>{{ name }}</span>
      <span class="nameSpan">{{ teacher }}</span>
    </div>
    <input
      v-if="isEditing"
      v-model="tableContent[rowIndex][cellIndex]"
      type="text"
    />
  </td>
</template>

<script>
import { storeToRefs } from "pinia";
import { useTimetableStore } from "../stores/timetableInfo.js";

export default {
  setup() {
    const { isEditing, tableContent, teachers, colors } = storeToRefs(
      useTimetableStore(),
    );
    return { isEditing, tableContent, teachers, colors };
  },
  props: {
    rowIndex: {
      type: Number,
      required: false,
    },
    cellIndex: {
      type: Number,
      required: false,
    },
  },
  computed: {
    name() {
      return this.tableContent[this.rowIndex][this.cellIndex] ?? "";
    },
    hideContent() {
      return (
        this.tableContent[this.rowIndex]?.[this.cellIndex] ==
        this.tableContent[this.rowIndex - 1]?.[this.cellIndex]
      );
    },
    teacher() {
      return this.teachers[this.name]?.replace(/\+/g, "\n");
    },
    color() {
      return this.colors[this.name] ?? 0;
    },
  },
};
</script>

<style lang="scss" scoped>
input[type="text"] {
  width: 100%;
}

td {
  padding: 0.3rem 1rem;
}

.nameSpan {
  position: absolute;
  bottom: 0.25rem;
  right: 0.5rem;
  font-size: large;
  white-space: pre;
}

.cell {
  position: relative;
  text-align: left;
  background-color: hsla(var(--color), 100%, 40%, var(--default-opacity));

  &:hover {
    background-color: hsla(
      var(--color),
      100%,
      40%,
      calc(var(--default-opacity) * 2.25)
    );
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    background-color: hsl(var(--color), 100%, 40%);
    z-index: 100;
  }

  &::before {
    top: calc(2px - var(--heightOffset));
    left: 4px;
    height: calc(100% - 4px + var(--heightOffset));
    width: 4px;
  }

  &::after {
    top: 2px;
    left: 2px;
    height: var(--width);
    width: var(--width);
  }
}
</style>
