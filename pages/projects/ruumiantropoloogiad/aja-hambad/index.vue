<script setup lang="ts">
const { data: event, error } = await useEventBySlug("aja-hambad" as string);
const { data: events } = await useEvents({
  filters: {
    slug: {
      $ne: "aja-hambad",
    },
    projects: {
      id: {
        $in: event.value.projects[0].id,
      },
    },
  },
});
const { data: blogs } = await useBlogPosts();
// TODO: Make this more dynamic
useHead({
  title: `${event.value.title} – elektron.art`,
});
const { lang } = useLang();

breadcrumbs.value = [
  {
    title: "Projects",
    link: "/projects",
  },
  {
    title: ["Anthropologies of space", "Ruumiantropoloogiad"][lang.value],
    link: `/projects/ruumiantropoloogiad`,
  },
  {
    title: event.value.title,
    link: `/projects/ruumiantropoloogiad/${event.value.slug}`,
  },
];
</script>

<template>
  <ErrorCard v-if="error" />
  <AnthroPage v-else :event="event" :events="events">
    <BlogItems v-if="blogs">
      <BlogItem
        v-for="item in blogs"
        :key="item.id"
        :thumbnail="item.thumbnail"
        :titles="item.titles"
        :slug="`/projects/ruumiantropoloogiad/aja-hambad/${item.slug}`"
      />
    </BlogItems>
  </AnthroPage>
</template>
