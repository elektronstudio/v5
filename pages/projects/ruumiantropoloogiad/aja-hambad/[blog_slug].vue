<script setup lang="ts">
const route = useRoute();
const slug = route.params.blog_slug;

const { data: post, error } = await useBlogPostBySlug(slug as string);
const { lang } = useLang();

useHead({
  title: `${post.value.title} – elektron.art`,
});

breadcrumbs.value = [];
</script>

<template>
  <ErrorCard v-if="error" />

  <div v-else class="blogPost">
    <header class="postHeader">
      <EImageCard
        v-if="post.thumbnail"
        class="postThumbnail"
        :media="post.thumbnail"
      />
      <div>
        <ETitle size="lg" el="h1" class="postTitle">
          {{ post.titles[lang] }}
        </ETitle>
        <date>{{ formatDatetime(post.date) }}</date>
      </div>
    </header>
    <EBox class="postContent">
      <EContent :content="post.contents[lang]" />
    </EBox>
  </div>
  <BackgroundImage v-if="post.backgroundImage" :image="post.backgroundImage" />
</template>

<style scoped>
.blogPost {
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
  padding: var(--p-4);
}

.postHeader {
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
  color: var(--gray-300);
}

.postHeader :deep(h1) {
  margin-bottom: var(--m-1);
}

.postContent {
  color: var(--gray-300);
}

@media only screen and (min-width: 600px) {
  .blogPost {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
