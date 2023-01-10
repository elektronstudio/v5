<script setup lang="ts">
const { data: event, error } = await useEventBySlug("walk" as string);
console.log(event.value.projects[0].id);
const { data: events } = await useEvents({
  filters: {
    slug: {
      $ne: "walk",
    },
    projects: {
      id: {
        $in: event.value.projects[0].id,
      },
    },
  },
});

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
  <AnthroPage v-else :event="event" :events="events" />
</template>
