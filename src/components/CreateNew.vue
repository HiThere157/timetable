<template>
  <button @click="redirectToTemplate">Create new from Template</button>
</template>

<script>
export default {
  methods: {
    redirectToTemplate() {
      window.location.href = window.location.origin + window.location.pathname + "?t=Template";
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  font-size: x-large;
}
</style>
