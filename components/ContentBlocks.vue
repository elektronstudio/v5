<script setup lang="ts">
type Card = {
  id: number;
  __component:
    | "content.title"
    | "content.about-card"
    | "content.related-page"
    | "content.person-card"
    | "content.image-card"
    | "content.external-link"
    | "content.media-card";
  title: string;
  content: string;
  description?: string;
  name?: string;
  url?: string;
  layout?: "columns1" | "columns1-5" | "columns2" | "columns3" | "columns4";
  image?: any;
  media?: any;
  page?: {
    data: {
      attributes: {
        title: string;
        slug: string;
      };
    };
  };
};

type Props = {
  cards: Card[];
};

const { cards } = defineProps<Props>();
</script>

<template>
  <section class="ContentBlocks">
    <template v-for="item in cards">
      <ETitle v-if="item.__component === 'content.title'" el="h2" size="lg">
        {{ item.title }}
      </ETitle>
      <EAboutPageCard
        v-else-if="item.__component === 'content.about-card'"
        :layout="item.layout"
        :title="item.title"
        :content="item.content"
      />
      <NuxtLink
        v-else-if="
          item.__component === 'content.related-page' &&
          item.page?.data?.attributes.slug
        "
        :to="item.page?.data?.attributes.slug"
      >
        <ERelatedPageCard :title="item.title" />
      </NuxtLink>
      <EExternallinkCard
        v-else-if="item.__component === 'content.external-link'"
        :title="item.title"
        :url="item.url"
      />
      <ETeamCard
        v-else-if="item.__component === 'content.person-card'"
        :media="item?.image"
        :name="item.name"
        :content="item.content"
      />
      <EImageCard
        v-else-if="item.__component === 'content.image-card'"
        :media="item.image"
        :layout="item.layout"
      />
      <EMediaCard
        v-else-if="item.__component === 'content.media-card'"
        :layout="item.layout"
        :title="item.title"
        :description="item.description"
        :media="item.media"
      />
    </template>
  </section>
</template>

<style scoped>
.ContentBlocks {
  display: flex;
  flex-direction: column;
  gap: var(--gap-5);
  padding: 0 var(--p-4);
  margin-bottom: var(--m-12);
}
.ContentBlocks > h2 {
  grid-column: 1 / -1;
}
.ContentBlocks > h2:not(:first-child) {
  margin-top: var(--m-8);
}
/* TODO: Add breakpoints system */
@media only screen and (min-width: 600px) {
  .ContentBlocks {
    display: grid;
    grid-gap: var(--gap-5);
    grid-template-columns: repeat(2, 1fr);
  }
}
/* TODO: Add breakpoints system */
@media only screen and (min-width: 1240px) {
  .ContentBlocks {
    grid-template-columns: repeat(12, 1fr);
  }
  .ContentBlocks .ECard {
    grid-column: span 3;
  }
}
</style>
