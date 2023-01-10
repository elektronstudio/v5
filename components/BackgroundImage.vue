<script setup lang="ts">
import { MediaItem } from "~~/types";

type Props = {
  image: MediaItem;
};

const { image } = defineProps<Props>();
</script>

<template>
  <div class="BackgroundImage">
    <EImage :media="image" />
  </div>
</template>

<style scoped>
.BackgroundImage {
  position: fixed;
  width: 100%;
  height: 100%;
  inset: 0;
  z-index: -1;
  filter: blur(50px);
  opacity: 0.4;
  object-fit: cover;
}
</style>
