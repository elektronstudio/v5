<script setup lang="ts">
import { useDraggable } from "@vueuse/core";
import type { DraggableProps } from "~~/types";

const {
  titles,
  x,
  y,
  id,
  tilesWidth = 1,
  tilesHeight,
  maximisable = false,
  hideTitleBarOnIdle,
  updateXY,
  getDocked,
  setDocked,
  getIndex,
  getMaximised,
  toggleMaximised,
  updateIndex,
  getTop,
} = defineProps<DraggableProps>();

const { lang } = useLang();

const draggableRef = ref<HTMLElement | null>(null);
// const mobile = breakpoints.smaller("large");
const { width: windowWidth } = useWindow();
const tileDivider = 20;
const tileSize = ref(windowWidth.value / tileDivider);
const finalAnimation = ref<DOMRect | undefined>();

const {
  x: draggableX,
  y: draggableY,
  style,
  isDragging,
} = useDraggable(draggableRef, {
  preventDefault: true,
  onEnd: () => {
    calculateCoordinates();
  },
});

const calculateCoordinates = function () {
  const snappedX = Math.round(draggableX.value / tileSize.value);
  const snappedY = Math.round(draggableY.value / tileSize.value);
  draggableX.value =
    snappedX + tilesWidth >= tileDivider
      ? (tileDivider - tilesWidth) * tileSize.value
      : snappedX >= 0
      ? tileSize.value * snappedX
      : 0;
  draggableY.value = snappedY >= 0 ? tileSize.value * snappedY : 0;
  updateXY({ x: snappedX, y: snappedY });
};

const handleResize = () => {
  tileSize.value = windowWidth.value / tileDivider;
  draggableX.value = tileSize.value * x.value;
  draggableY.value = tileSize.value * y.value;
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

function findCoordinates(el: Element, done: () => void) {
  // TODO: Find a better solution for this
  // Consider using refs for selectors
  const $draggableDocked = document.querySelector(
    `.DraggablesDock .EDraggableTitlebar[data-id="${id}"]`,
  );
  const draggableDockedRect = $draggableDocked?.getBoundingClientRect();
  finalAnimation.value = draggableDockedRect;

  el.addEventListener("animationend", () => {
    done();
  });
}
</script>

<template>
  <Transition @enter="findCoordinates" @leave="findCoordinates">
    <div
      class="EDraggable"
      :style="`${style} width: calc(${tilesWidth} * var(--breadboard-tile-size));
    height: calc(${tilesHeight} * var(--breadboard-tile-size));  z-index: calc(${getIndex()} + 1);`"
      style="touch-action: none"
      :class="{
        isDragging: isDragging,
        noHeight: !tilesHeight,
        maximised: getMaximised(),
        hideTitleBarOnIdle: hideTitleBarOnIdle,
      }"
      v-show="!getDocked()"
      @click.stop="updateIndex()"
    >
      <nav class="topBarNav">
        <ETitlebarButton
          v-if="maximisable"
          icon="size"
          @click.stop="toggleMaximised()"
        />
        <ETitlebarButton icon="minus" @click.stop="setDocked()" />
      </nav>
      <div class="titleBar" ref="draggableRef">
        <EDraggableTitlebar
          :title="titles?.[lang]"
          :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
        />
      </div>
      <article
        :style="{
          height: tilesHeight
            ? `calc(${tilesHeight} * var(--breadboard-tile-size) - var(--h-6))`
            : 'auto',
        }"
      >
        <slot />
      </article>
    </div>
  </Transition>
</template>

<style scoped>
.EDraggable {
  position: relative;
  background-color: var(--bg);
  display: flex;
  flex-direction: column;
}
.EDraggable.isDragging {
  z-index: 100;
}
.topBarNav {
  z-index: 2;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
}

/* TODO: Add breakpoints system */
@media only screen and (max-width: 899px) {
  .EDraggable {
    top: auto !important;
    left: auto !important;
    flex-grow: 1;
  }
  .EDraggable article {
    position: absolute;
    width: 100%;
    height: 100% !important;
    padding-top: var(--h-6);
    flex-grow: 1;
    overflow-y: auto;
  }
}
@media only screen and (min-width: 900px) {
  .EDraggable {
    position: fixed;
    touch-action: none;
    border: 1px solid var(--gray-600);
  }
  .EDraggable article {
    flex-grow: 1;
    overflow-y: auto;
  }
  .EDraggable.noHeight {
    height: auto;
  }
  .EDraggable.maximised {
    width: 100% !important;
    height: 100% !important;
    top: 0 !important;
    left: 0 !important;
  }
  .EDraggable.maximised article,
  /* TODO: How to select an Art only component */
  .EDraggable.maximised article :deep(.videoStream),
  .EDraggable.maximised :deep(video) {
    height: 100%;
  }
  .EDraggable.maximised video {
    object-fit: contain;
  }
  .EDraggable:hover {
    border: 1px solid var(--gray-500);
  }
  .EDraggable.hideTitleBarOnIdle .titleBar {
    position: absolute;
    z-index: 1;
    width: 100%;
  }
  .EDraggable.hideTitleBarOnIdle:hover :is(.titleBar, .topBarNav, .controls) {
    opacity: 1;
  }
  .idle .EDraggable.maximised :is(.titleBar, .topBarNav),
  .EDraggable.hideTitleBarOnIdle :is(.titleBar, .topBarNav, .controls) {
    opacity: 0;
    transition: 0.3s ease-in-out;
  }

  .EDraggable.hideTitleBarOnIdle article {
    padding-top: 0;
  }
  @keyframes windowAnimation {
    100% {
      top: v-bind("`${finalAnimation?.y ? finalAnimation.y : 0}px`");
      left: v-bind(
        "`calc(${finalAnimation?.x ? finalAnimation.x : 0}px + var(--dock-item-size) / 2)`"
      );
      width: 0;
      height: var(--h-6);
      opacity: 0;
    }
  }
}

.EDraggable.v-enter-active {
  animation: windowAnimation 0.5s ease-in-out reverse;
}

.EDraggable.v-leave-active {
  animation: windowAnimation 0.5s ease-in-out forwards;
}
.EDraggable.v-enter-active *,
.EDraggable.v-leave-active * {
  display: none;
}
</style>
