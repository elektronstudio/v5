<script setup lang="ts">
type Props = {
  title?: string;
};

const { title } = defineProps<Props>();
</script>
<template>
  <EBox color="accent" ratio="1 / 1" layout="columns1">
    <ETitle v-if="title" el="h3" size="lg" :title="title" />
    <EContent>Read more</EContent>
  </EBox>
</template>

<style scoped>
.EBox {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
