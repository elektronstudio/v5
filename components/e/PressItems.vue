<script setup lang="ts">
type Props = {
  items: {
    title: string;
    link: string;
    description: string;
  }[];
};

const { items } = defineProps<Props>();
</script>

<template>
  <section class="EPressItems">
    <a v-for="item in items" :href="item.link" target="_blank">
      <ETitle size="xs">{{ item.title }}</ETitle>
      <EContent>
        <p>
          <small>{{ item.description }}</small>
        </p>
      </EContent>
    </a>
  </section>
</template>

<style scoped>
.EPressItems {
  display: flex;
  flex-direction: column;
}

.EPressItems h4 {
  color: var(--fg);
}

.EPressItems a {
  padding-top: var(--p-3);
  margin-bottom: var(--m-3);
  border-top: 1px solid var(--gray-500);
}
.EPressItems a:hover > * {
  color: var(--gray-300);
}
.EPressItems p {
  line-height: var(--line-height-xs);
  color: var(--gray-300);
}
</style>
