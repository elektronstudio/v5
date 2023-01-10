<script setup lang="ts">
import { MediaItem } from "~~/types";

type Props = {
  layout?: "columns1" | "columns1-5" | "columns2" | "columns3" | "columns4";
  media: MediaItem;
};

const { layout = "columns1", media } = defineProps<Props>();
</script>

<template>
  <EBox class="EImageCard" :class="layout">
    <EImage :media="media" v-if="media.mime.startsWith('image/')" />
    <EVideo :media="media" v-else-if="media.mime.startsWith('video/')" />
  </EBox>
</template>

<style scoped>
.EBox {
  padding: 0;
  overflow: hidden;
  position: relative;
  aspect-ratio: 16 / 9;
}
.EBox .EImage,
.EBox .EVideo {
  object-fit: cover;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
