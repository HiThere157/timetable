<template>
  <div class="container">
    <table class="table">
      <tr class="headerRow">
        <th>Lesson</th>
        <th>
          <Info title="Teacher" text="Use ',' to seperate multiple Names" />
        </th>
        <th>Color</th>
        <th>Action</th>
      </tr>
      <tr v-for="lesson in Object.keys(colors)">
        <td>{{ lesson }}</td>
        <td>
          <input v-model="teachers[lesson]" type="text" />
        </td>
        <td>
          <input
            :style="{
              '--color': colors[lesson],
            }"
            v-model="colors[lesson]"
            type="range"
            min="0"
            max="360"
          />
        </td>
        <td>
          <button class="icon" @click="removeLesson(lesson)">
            <TrashIcon />
          </button>
        </td>
      </tr>
    </table>
    <div class="addNewLessonContainer">
      <span>Add New Lesson:</span>
      <input v-model="addNewLesson" type="text" />
      <button class="icon" @click="addLesson"><AddIcon /></button>
    </div>
  </div>
</template>

<script>
import Info from "./Info.vue";
import AddIcon from "../icons/Add.vue";
import TrashIcon from "../icons/Trash.vue";

import { storeToRefs } from "pinia";
import { useTimetableStore } from "../stores/timetableInfo.js";

export default {
  setup() {
    const { isEditing, teachers, colors } = storeToRefs(useTimetableStore());
    return { isEditing, teachers, colors };
  },
  data() {
    return {
      addNewLesson: "",
    };
  },
  methods: {
    removeLesson(lesson) {
      delete this.colors[lesson];
      delete this.teachers[lesson];
    },
    addLesson() {
      this.colors[this.addNewLesson] = "0";
      this.teachers[this.addNewLesson] = "";
      this.addNewLesson = "";
    },
  },
  components: {
    Info,
    AddIcon,
    TrashIcon,
  },
};
</script>

<style lang="scss" scoped>
input[type="text"],
input[type="range"] {
  width: 90%;
}

input[type="range"] {
  background-color: hsla(
    var(--color),
    100%,
    40%,
    calc(var(--default-opacity) * 2.25)
  );

  &::-webkit-slider-thumb {
    background-color: hsl(var(--color), 100%, 40%);
  }
}

.container {
  display: flex;
  width: 80%;
  margin-top: 3rem;
  flex-direction: column;
  align-items: center;
  font-size: x-large;
}

.table {
  width: 100%;
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

.addNewLessonContainer {
  display: flex;
  margin-top: 1.5rem;
  justify-content: space-between;
  align-items: center;
  column-gap: 0.5rem;

  & span {
    white-space: nowrap;
  }
}
</style>
