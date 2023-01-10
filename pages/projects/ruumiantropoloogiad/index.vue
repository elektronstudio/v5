<script setup lang="ts">
const route = useRoute();
const slug = "ruumiantropoloogiad";
const { data: project, error } = await useProjectBySlug(slug as string);
const { data: events } = await useEvents({
  filters: {
    projects: {
      id: {
        $in: project.value.id,
      },
    },
  },
});

// TODO: Make this more dynamic
useHead({
  title: `${project.value.title} – elektron.art`,
});

breadcrumbs.value = [
  {
    title: "Projects",
    link: "/projects",
  },
  {
    title: project.value.title,
    link: `/projects/${project.value.slug}`,
  },
];

// const project = data.value as Project;
const { lang } = useLang();
</script>

<template>
  <ErrorCard v-if="error" />

  <article v-else class="Page SingleProduction">
    <header class="eventHeader">
      <div class="eventTitles">
        <h2 class="ETitle lg">{{ project.titles[lang] }}</h2>
        <ETitle v-if="project.authors" el="h5" size="xs">
          {{ project.authors }}
        </ETitle>
      </div>

      <EContent
        v-if="project.intros[lang]"
        class="eventDescription"
        size="lg"
        :content="project.intros[lang]"
      />
      <EBox class="eventDetails">
        <EDetailsList
          v-if="project.detailss[lang]"
          :details="parseDetails(project.detailss[lang])"
        />
        <EContent el="div" :content="project.descriptions[lang]" />
      </EBox>
    </header>
    <AnthroFooter :events="events">
      <EImageCard :media="project.video" ratio="16 / 9" />
    </AnthroFooter>
  </article>
  <BackgroundImage
    v-if="project.backgroundImage"
    :image="project.backgroundImage"
  />
</template>

<style scoped>
.eventHeader {
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
  color: var(--gray-300);
  padding: 0 var(--p-4);
}

.eventHeader {
  grid-template-areas:
    "title"
    "subtitle"
    "description";
}

.eventHeader .eventTitles {
  grid-area: title;
}
.eventHeader .eventTitles h2 {
  margin-bottom: var(--m-3);
}

.eventHeader h4 {
  grid-area: subtitle;
  align-self: end;
}

.eventHeader .eventDescription {
  grid-area: description;
}

/* TODO: Add breakpoints system */
@media only screen and (max-width: 599px) {
  .EContent.eventDescription :deep(p) {
    font-size: var(--text-xl);
  }
}
@media only screen and (min-width: 600px) {
  .eventHeader {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-template-areas: "title title description description" "content content content content";
  }

  .eventDetails {
    grid-area: content;
  }
}
@media only screen and (min-width: 1240px) {
  .eventHeader {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }
  .eventHeader {
    grid-template-areas:
      "title title title description description description description description"
      ". . . content content content content content";
  }
  .eventDetails {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    grid-template-areas: "details details content content content";
  }

  .eventDetails > .EDetailsList {
    grid-area: details;
  }
  .eventDetails > .EContent {
    grid-area: content;
  }
}
</style>
