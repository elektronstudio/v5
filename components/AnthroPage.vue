<script lang="ts" setup>
type Props = {
  event: any;
  events: any;
};

const { event, events } = defineProps<Props>();
const { lang } = useLang();
</script>

<template>
  <article class="Page SingleProduction">
    <header class="eventHeader">
      <div class="eventTitles">
        <h2 class="ETitle lg">{{ event.titles[lang] }}</h2>
        <h4 v-if="event.authors">{{ event.authors }}</h4>
      </div>
      <EBox class="eventDetails">
        <EDetailsList
          v-if="event.detailss[lang]"
          :details="parseDetails(event.detailss[lang])"
        />
        <EContent :content="event.descriptions[lang]" />
      </EBox>
    </header>
    <ImageSlider v-if="event.images" :images="event.images" />
    <ContentBlocks
      :key="lang"
      :cards="lang === 0 ? event.cards : event.localizations[0].cards"
    />
    <slot />
    <AnthroFooter :events="events">
      <ETitle el="h3" size="lg">{{
        ["Ruumiantropoloogiad", "Anthropologies of space"][lang]
      }}</ETitle>
      <p>
        Aliquip veniam culpa id ut ad duis do id esse Lorem consectetur. Esse
        nisi officia elit deserunt. Et cillum veniam nostrud consequat magna
        dolor nostrud cupidatat. Do et cupidatat veniam sunt excepteur cupidatat
        irure non veniam. Duis nisi sit ex sit eu magna eiusmod ullamco dolore
        officia. Eu deserunt veniam nisi nisi anim veniam.
      </p>
    </AnthroFooter>
  </article>
  <BackgroundImage
    v-if="event.backgroundImage"
    :image="event.backgroundImage"
  />
</template>

<style scoped>
.eventHeader {
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
  color: var(--gray-300);
  padding: 0 var(--p-4);
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

.eventItems {
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
}

.eventItem {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
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
    grid-template-areas: "title title title title" "content content content content";
  }

  .eventDetails {
    grid-area: content;
  }
  .eventItems {
    grid-area: items;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--gap-5);
  }
}
@media only screen and (min-width: 1240px) {
  .eventHeader {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }
  .eventHeader {
    grid-template-areas: "title title title content content content content content";
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
