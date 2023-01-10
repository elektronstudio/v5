<script lang="ts" setup>
type Props = {
  slug: string;
  thumbnail: {
    url: string;
  };
  titles: string;
};

const { slug, thumbnail, titles } = defineProps<Props>();
const { lang } = useLang();
</script>

<template>
  <NuxtLink :href="slug" class="blogItem EBox">
    <img v-if="thumbnail" class="postThumbnail" :src="thumbnail.url" />
    <ETitle v-if="titles" el="h3" size="lg">
      {{ titles[lang] }}
    </ETitle>
    <EButton color="accent" size="xs">
      {{ ["Read more", "Loe postitust"][lang] }}
    </EButton>
  </NuxtLink>
</template>

<style scoped>
.blogItem {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
}
.blogItem .ETitle,
.postThumbnail {
  transition: opacity 0.3s ease-in-out;
}

.postThumbnail {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0;
  object-fit: cover;
}

.blogItem:hover .postThumbnail {
  opacity: 1;
}
.blogItem:hover .ETitle {
  opacity: 0;
}
</style>
