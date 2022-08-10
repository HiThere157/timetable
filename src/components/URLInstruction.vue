<template>
  <div>
    <div class="background" @click="$emit('close')"></div>
    <div class="container">
      <span
        >Your Timetable has been saved to your browser's address bar. You can
        share this URL with others to share your timetable.</span
      >

      <div class="actions">
        <div>
          <input id="dontShow" type="checkbox" @change="updateDontShow" />
          <label class="dontShow" for="dontShow">Don't show this again</label>
        </div>
        <button @click="$emit('close')">Got It!</button>
      </div>

      <div class="arrow"><InstructionArrow /></div>
    </div>
  </div>
</template>

<script>
import InstructionArrow from "../icons/InstructionArrow.vue";

export default {
  mounted() {
    if (localStorage.getItem("_dontShowURLInstruction") === "true") {
      this.$emit("close");
    }
  },
  methods: {
    updateDontShow(event) {
      const checked = event.target.checked;
      localStorage.setItem("_dontShowURLInstruction", checked);
    },
  },
  components: {
    InstructionArrow,
  },
};
</script>

<style lang="scss" scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #000;
  opacity: 0.7;
  z-index: 400;
}

.container {
  position: fixed;
  top: 0;
  left: 5rem;
  height: 10rem;
  width: 40rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: var(--color-background);
  font-size: 1.3rem;

  z-index: 450;
}

.actions {
  position: absolute;
  display: flex;
  bottom: 0;
  right: 0;
  left: 0;
  margin: 0.75rem;

  align-items: center;
  justify-content: space-between;

  & > div {
    display: flex;
    align-items: center;
    column-gap: 0.5rem;
  }
}

.dontShow {
  font-size: 1.1rem;
}

.arrow {
  position: absolute;
  top: 0.5rem;
  right: -9.5rem;
  width: 8rem;
  margin: 0.5rem;
}
</style>
