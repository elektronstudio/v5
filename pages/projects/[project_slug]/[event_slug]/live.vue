<script setup lang="ts">
import type { Urgency } from "~~/types";

const route = useRoute();
const slug = route.params.event_slug as string;
const { lang } = useLang();
const { data: event, error } = await useEventBySlug(slug as string);
breadcrumbs.value = [];
useHead({
  title: `${event.value.title} – elektron.art`,
});

const draggables = useDraggables({
  video: {
    titles: ["Stream", "Stream"],
    contentType: "video",
    initialX: 0,
    initialY: 1,
    tilesWidth: 15,
    maximisable: true,
    hideTitleBarOnIdle: true,
  },
  chat: {
    contentType: "chat",
    initialX: 16,
    initialY: 1,
    tilesWidth: 4,
    tilesHeight: 8,
  },
  about: {
    tilesWidth: 8,
    tilesHeight: 4,
    initialX: 1,
    initialY: 6,
  },
  controls: {
    tilesWidth: 4,
    tilesHeight: 2,
    initialX: 10,
    initialY: 6,
  },
});

const controls = parseControls(event.value.controls);
const hasTicket = ref<boolean>(false);
const dialogState = ref<boolean>(true);

// @TODO: Move this to processing level
const { urgency } = useDatetime(event.value.start_at, event.value.end_at);
const urgencyLabel = computed(() => {
  if (urgency.value === ("future" as Urgency)) {
    return ["upcoming", "tulemas"];
  } else if (urgency.value === ("soon" as Urgency)) {
    return ["soon", "varsti"];
  } else if (urgency.value === ("now" as Urgency)) {
    return ["live", "live"];
  } else {
    return ["new", "uus"];
  }
});

const noTicketDraggables = useDraggables({
  preview: {
    titles: urgencyLabel.value,
    initialX: 6,
    initialY: 2,
    tilesWidth: 8,
    // tilesHeight: 5,
  },
});

onMounted(() => {
  const fientaValidate = getTicketableStatus([event.value]);

  if (fientaValidate.status !== "REQUIRES_TICKET") {
    hasTicket.value = true;
  }
});
</script>

<template>
  <div>
    <BackToEvent :link="event.eventLink" />
    <EBreadBoard v-if="!hasTicket">
      <DraggableHoc v-bind="noTicketDraggables.preview">
        <EventPreview
          :event="event"
          :dialog-state="dialogState"
          @close-dialog="dialogState = false"
        />
      </DraggableHoc>
      <DraggablesDock :draggables="noTicketDraggables" />
    </EBreadBoard>
    <EBreadBoard v-else>
      <DraggableHoc v-bind="draggables.video" v-if="event.vimeoId">
        <VimeoIframe v-if="event.vimeoId" :id="event.vimeoId" />
      </DraggableHoc>
      <DraggableHoc v-bind="draggables.chat">
        <Chat :channel="slug" />
      </DraggableHoc>
      <DraggableHoc v-bind="draggables.about">
        <EStack style="padding: var(--p-5)">
          <ETitle size="lg">{{ event.title }}</ETitle>
          <EContent :content="event.live_contents[lang]" />
        </EStack>
      </DraggableHoc>
      <DraggableHoc v-if="event.controls" v-bind="draggables.controls">
        <Controls :controls="controls" />
      </DraggableHoc>

      <DraggablesDock :draggables="draggables" />
    </EBreadBoard>
  </div>
</template>
