<script setup lang="ts">
import { useInterval, useStorage } from "@vueuse/core";

type Emits = {
  (e: "click"): void;
  (e: "remaining", value: number): void;
};

const emit = defineEmits<Emits>();

const max = 100;
const step = 100;
const maxclicks = 3;

const {
  counter: recharge,
  resume: startRecharge,
  pause: stopRecharge,
  isActive: recharging,
} = useInterval(step, { controls: true });

const clicks = useState("elektron_clicks", () =>
  useStorage("elektron_clicks", maxclicks),
);

if (clicks.value === 0) {
  startRecharge();
} else {
  stopRecharge();
}

const remaining = computed(() =>
  Math.floor(
    (recharging.value ? (max - recharge.value) * step : max * step) / 1000,
  ),
);
watch(remaining, () => emit("remaining", remaining.value), { immediate: true });

const clicksStyle = computed(() => ({
  width: `${remap(clicks.value, 0, maxclicks, 0, 100)}%`,
}));
const rechargeStyle = computed(() => ({
  width: `${remap(recharge.value, 0, max, 0, 100)}%`,
}));

const onClick = () => {
  if (clicks.value > 0) {
    clicks.value--;
    emit("click");
  }
  if (clicks.value === 0 && !recharging.value) {
    recharge.value = 0;
    startRecharge();
  }
};
watch(recharge, () => {
  if (recharge.value >= max) {
    stopRecharge();
    recharge.value = 0;
    clicks.value = maxclicks;
  }
});
</script>
<template>
  <div class="RechargingButton" :class="{ recharging: 'recharging' }">
    <EButton
      class="border-neutral-200 bg-neutral-200 text-neutral-700 transition hover:border-neutral-200 hover:bg-neutral-200"
      color="accent"
      @click="onClick"
    >
      <slot />
    </EButton>
    <div
      class="pointer-events-none absolute left-0 top-0 bottom-0 bg-green-400 mix-blend-multiply transition duration-1000"
      :class="recharging ? 'opacity-0' : 'opacity-100'"
      :style="clicksStyle"
    />
    <div
      class="pointer-events-none absolute left-0 bottom-0 h-1 bg-green-400 mix-blend-multiply"
      :style="rechargeStyle"
    />
  </div>
</template>

<style scoped>
.RechargingButton {
  position: relative;
  display: inline-flex;
  overflow: hidden;
  white-space: nowrap;
  border-radius: var(--rounded-DEFAULT);
  cursor: pointer;
}
.RechargingButton.recharging {
  cursor: default;
  color: var(--gray-200);
}
</style>
