<template>
  <button class="icon" @click="toggleTheme">
    <MoonIcon v-if="isLight" />
    <SunIcon v-else />
  </button>
</template>

<script>
import SunIcon from "../../icons/Sun.vue";
import MoonIcon from "../../icons/Moon.vue";

export default {
  data() {
    return {
      isLight: false,
    };
  },
  mounted() {
    this.isLight = localStorage.getItem("_theme") === "light";
    this.setTheme();
  },
  methods: {
    setTheme() {
      const themeName = this.isLight ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", themeName);
      localStorage.setItem("_theme", themeName);
    },
    toggleTheme() {
      this.isLight = !this.isLight;
      this.setTheme();
    },
  },
  components: {
    SunIcon,
    MoonIcon,
  },
};
</script>

<style></style>
