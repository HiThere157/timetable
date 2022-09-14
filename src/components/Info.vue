<template>
  <div class="infoContainer">
    {{ title }}
    <div>
      <InfoIcon />
      <div class="text">
        <span>
          {{ text }}
        </span>
      </div>
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

  & > div {
    position: relative;
    display: flex;
    width: 100%;
    align-items: center;
  }

  &:hover .text {
    opacity: 1;
  }
}

.text {
  position: absolute;
  opacity: 0;
  padding: 0.75rem;
  background-color: var(--color-background-mute);
  border-radius: 0.2rem;
  transform: translateX(3rem);
  font-size: medium;
  z-index: 450;

  &::before {
    content: "";
    position: absolute;
    left: -1.5rem;
    top: 50%;
    display: block;
    height: 2rem;
    aspect-ratio: 1;
    background-color: var(--color-background-mute);
    border-radius: 0.2rem;
    transform: rotate(45deg) translateY(-75%);
    z-index: -1;
  }
}
</style>
