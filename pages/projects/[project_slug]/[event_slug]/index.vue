<script setup lang="ts">
const route = useRoute();
const slug = route.params.event_slug;

const { data: event, error } = await useEventBySlug(slug as string);
// TODO: Make this more dynamic
useHead({
  title: `${event.value.title} – elektron.art`,
});

breadcrumbs.value = [
  {
    title: "Projects",
    link: "/projects",
  },
  {
    title: event.value.projects[0].title,
    link: `/projects/${event.value.projects[0].slug}`,
  },
  {
    title: event.value.title,
    link: `/projects/${event.value.projects[0].slug}/${event.value.slug}`,
  },
];

const { lang } = useLang();
</script>

<template>
  <ErrorCard v-if="error" />
  <article v-else class="Page SingleProduction">
    <header class="eventHeader">
      <div class="title">
        <!-- <NuxtLink v-if="event.projectLink" :to="event.projectLink">
          <EButton size="xs" el="a" color="transparent">
            <Icon name="radix-icons:arrow-left" />
            {{ event.projects[0].titles[lang] }}
          </EButton>
        </NuxtLink> -->
        <h2 class="ETitle lg">{{ event.titles[lang] }}</h2>
        <h4 v-if="event.authors">{{ event.authors }}</h4>
      </div>
      <EContent
        v-if="event.intros"
        class="Description"
        size="lg"
        :content="event.intros[lang]"
      />
      <div class="buttons">
        <EventButtons :event="event" />
      </div>
    </header>
    <ImageSlider v-if="event.images" :images="event.images" />
    <main class="mainContent">
      <EBox class="eventContent">
        <!-- TODO: Add metadata -->
        <EDetailsList
          v-if="event.detailss[lang]"
          :details="parseDetails(event.detailss[lang])"
        />
        <EContent :content="event.descriptions[lang]" />
      </EBox>
    </main>
  </article>
  <BackgroundImage
    v-if="event.backgroundImage"
    :image="event.backgroundImage"
  />
</template>

<style scoped>
.eventHeader,
.mainContent {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: var(--gap-5);
  padding: 0 var(--p-4);
  color: var(--gray-300);
}

.eventHeader {
  grid-template-areas:
    "title"
    "subtitle"
    "description"
    "buttons";
}
.mainContent {
  align-content: start;
  grid-template-areas:
    "main"
    "side";
}

.eventHeader .title {
  grid-area: title;
}

.eventHeader .title h2 {
  margin-bottom: var(--m-3);
}

.eventHeader h4 {
  grid-area: subtitle;
  align-self: end;
}

.eventHeader .Description {
  grid-area: description;
}

.eventContent {
  align-self: start;
  grid-area: main;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: var(--gap-5);
}
.SideContent {
  grid-area: side;
  align-self: start;
}
.SideContent h3 {
  margin-bottom: var(--m-6);
}
.SideContent h3:not(:first-child) {
  margin-top: var(--m-8);
}

.buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  /* justify-content: flex-end; */
  gap: var(--gap-1);
  grid-area: buttons;
}

/* TODO: Add breakpoints system */
@media only screen and (max-width: 599px) {
  .EContent.Description :deep(p) {
    font-size: var(--text-xl);
  }
}
@media only screen and (min-width: 600px) {
  .eventHeader,
  .mainContent {
    grid-template-columns: repeat(4, 1fr);
  }
  .eventHeader {
    grid-template-areas:
      "title description description buttons"
      "subtitle description description buttons";
  }

  .mainContent {
    grid-template-areas: "main main main main" "side side side side";
  }
  .eventContent {
    grid-template-areas: "details content";
    grid-template-columns: 2fr 3fr;
  }
  .eventContent .EDetailsList {
    grid-area: details;
  }
  .eventContent .EContent {
    grid-area: content;
  }
}
@media only screen and (min-width: 1240px) {
  .eventHeader,
  .mainContent {
    grid-template-columns: repeat(8, 1fr);
  }
  .eventHeader {
    grid-template-areas:
      "title title description description description description buttons buttons"
      "subtitle subtitle description description description description buttons buttons";
  }
  .mainContent {
    grid-template-areas: "main main main main main side side side";
  }
}
</style>
