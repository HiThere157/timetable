<template>
  <div class="container">
    <table class="timetable-js">
      <tr class="headerRow">
        <template v-if="isEditing">
          <th style="width: 5em">Duration</th>
          <th style="width: 10em">
            <Info title="Times" text="Minimum Duration is 20 Minutes" />
          </th>
        </template>
        <th v-else style="width: 9em">Times</th>
        <th>Mon</th>
        <th>Tue</th>
        <th>Wed</th>
        <th>Thu</th>
        <th>Fri</th>
      </tr>
      <Row v-for="(n, index) in tableContent.length" :rowIndex="index" />
    </table>

    <template v-if="isEditing">
      <div class="changeLessonCountContainer">
        <span>Add or Remove Rows:</span>

        <button class="icon" @click="addRow"><AddIcon /></button>
        <button class="icon" @click="removeRow" :disabled="!canRemove">
          <RemoveIcon />
        </button>
      </div>

      <CreateNew />
    </template>

    <template v-else>
      <Bar :time="time" />
      <Footer :time="time" :day="day" />
    </template>
  </div>
</template>

<script>
import Row from "./Row.vue";
import Bar from "./Bar.vue";
import Info from "./Info.vue";
import Footer from "./Footer.vue";
import CreateNew from "./CreateNew.vue";
import AddIcon from "../icons/Add.vue";
import RemoveIcon from "../icons/Remove.vue";

import { storeToRefs } from "pinia";
import { useTimetableStore } from "../stores/timetableInfo.js";

export default {
  setup() {
    const { isEditing, tableContent, timeTemplate, rowLabels } = storeToRefs(
      useTimetableStore(),
    );
    return { isEditing, tableContent, timeTemplate, rowLabels };
  },
  props: {
    time: {
      type: Object,
      required: false,
    },
    day: {
      type: Number,
      required: false,
    },
  },
  computed: {
    canRemove() {
      return this.tableContent.length > 1;
    },
  },
  methods: {
    addRow() {
      this.tableContent.push(["", "", "", "", ""]);
      this.timeTemplate.push(45);
    },
    removeRow() {
      if (this.tableContent.length > 1) {
        this.tableContent.pop();
        this.timeTemplate.pop();
        this.rowLabels = this.rowLabels.slice(0, this.tableContent.length);
      }
    },
  },
  components: {
    Row,
    Bar,
    Info,
    Footer,
    CreateNew,
    AddIcon,
    RemoveIcon,
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
}

.timetable-js {
  width: 100%;
  font-size: x-large;
}

.headerRow {
  position: relative;
  height: 1.5em;
  vertical-align: top;
  user-select: none;

  & > * {
    text-align: left;

    &::after {
      content: "";
      position: absolute;
      display: block;
      bottom: 0.1em;
      height: 0.15em;
      left: -0.2em;
      width: calc(100% + 0.4em);
      background-color: var(--color-background-soft);
    }
  }
}

.changeLessonCountContainer {
  display: flex;
  margin: 1.5rem 0;
  justify-content: space-between;
  align-items: center;
  column-gap: 0.5rem;
  font-size: x-large;
}
</style>
