<script setup lang="ts">
import { MediaItem } from "~~/types";

type Props = {
  media: MediaItem;
};

const { media } = defineProps<Props>();
const { url } = media;
const el = ref<HTMLVideoElement | null>(null);
const state = ref("paused");

const handleClick = () => {
  const video = el.value as HTMLVideoElement;
  video.paused ? video.play() : video.pause();
};

onMounted(() => {
  const video = el.value as HTMLVideoElement;
  video.addEventListener("play", () => {
    state.value = "playing";
  });
  video.addEventListener("pause", () => {
    state.value = "paused";
  });
});
</script>

<template>
  <div class="EVideo">
    <button @click="handleClick">
      <Icon
        :name="state === 'paused' ? 'radix-icons:play' : 'radix-icons:pause'"
      />
    </button>
    <video ref="el" :src="url" autoplay loop muted />
  </div>
</template>

<style scoped>
.EVideo {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
}

.EVideo button {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  opacity: 0;
  transition: 0.3s ease-in-out;
  z-index: 1;
}
.EVideo button:hover {
  opacity: 1;
}

.EVideo video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
