<template>
  <div class="infoContainer">
    {{ title }}
    <div :title="text">
      <InfoIcon />
    </div>
  </div>
</template>

<script>
import InfoIcon from "../icons/Info.vue";

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  components: {
    InfoIcon,
  },
};
</script>

<style lang="scss" scoped>
svg {
  height: 1em;
  margin-left: 0.3rem;
}

.infoContainer {
  display: flex;
  align-items: center;

  & div {
    display: flex;
    align-items: center;
  }
}
</style>
