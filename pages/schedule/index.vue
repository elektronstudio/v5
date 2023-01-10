<script setup lang="ts">
const { lang } = useLang();

definePageMeta({
  title: "Schedule",
});

breadcrumbs.value = [];

const { data: upcomingEvents, error } = await useEvents({
  filters: { end_at: { $gt: today() } },
});
</script>

<template>
  <ErrorCard v-if="error" />
  <ScheduleWrapper v-else key="future">
    <aside>
      <ETitle size="lg" style="margin-bottom: var(--m-3)">
        {{ ["Upcoming events", "Tulevased sündmused"][lang] }}
      </ETitle>
      <NuxtLink to="/schedule/past" class="EButton xs anime">
        {{ ["See the past events", "Vaata toimunud sündmusi"][lang] }}
      </NuxtLink>
    </aside>
    <section>
      <ScheduleItem
        v-if="upcomingEvents?.length > 0"
        v-for="event in upcomingEvents"
        :event="event"
      />
      <ETitle
        v-else-if="!upcomingEvents || upcomingEvents?.length === 0"
        size="lg"
      >
        {{
          ["Currently no upcoming events", "Hetkel ei ole sündmusi tulemas"][
            lang
          ]
        }}
      </ETitle>
    </section>
  </ScheduleWrapper>
</template>
