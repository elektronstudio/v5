<script setup lang="ts">
// @TODO Type media
type Props = {
  layout?: "columns1" | "columns1-5" | "columns2" | "columns3" | "columns4";
  title?: string;
  description?: string;
  media: any;
};

const { layout = "columns1", title, description, media } = defineProps<Props>();
</script>
<template>
  <!-- TODO: minimum aspect ratio is probably needed -->
  <EBox :class="layout">
    <header>
      <ETitle v-if="title" el="h3" size="lg">
        {{ title }}
      </ETitle>
      <EContent v-if="description" :content="description" />
    </header>
    <EButton
      v-if="media"
      el="a"
      size="xs"
      color="accent"
      :href="media.url"
      rel="noreferrer"
      target="_blank"
    >
      {{ media.name }}
    </EButton>
  </EBox>
</template>

<style scoped>
.EBox {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}
.EBox h3 {
  margin-bottom: var(--m-2);
}
</style>
