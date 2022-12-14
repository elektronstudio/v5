<script setup lang="ts">
type Props = {
  modelValue?: number;
  label?: string;
  name?: string;
  min?: number;
  max?: number;
  step?: number;
};

const {
  modelValue = 0,
  label,
  name,
  min = 0,
  max = 10,
  step = 1,
} = defineProps<Props>();

const fieldId = randomString();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const inputValue = computed({
  get: () => modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

const backgroundSize = computed(
  () => ((modelValue - min) * 100) / (max - min) + "% 100%",
);
</script>
<template>
  <ELabel v-if="label" :fieldId="fieldId">{{ label }}</ELabel>
  <div class="EFormRange">
    <input
      v-model="inputValue"
      :name="name"
      :min="min"
      :max="max"
      :step="step"
      :id="fieldId"
      :style="{ backgroundSize }"
      type="range"
    />
  </div>
</template>

<style scoped>
.EFormRange {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  width: 100%;
  display: flex;
  align-items: center;
  height: 1rem;
}
.EFormRange .min {
  margin-right: var(--m-2);
}
.EFormRange .max {
  margin-left: var(--m-2);
}

input[type="range"] {
  appearance: none;
  width: 100%;
  height: var(--h-px);
  background-color: var(--gray-300);
  background-image: linear-gradient(var(--accent), var(--accent));
  background-repeat: no-repeat;
  /* padding: 0; */
  /* margin: 0; */
}

/* input[type="range"]:hover { */

/* } */
/* Input Thumb */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  height: var(--w-4);
  width: var(--h-4);
  border-radius: 50%;
  background: var(--fg);
  cursor: ew-resize;
  box-shadow: none;
  border: none;
  outline: none;
}

input[type="range"]::-moz-range-thumb {
  appearance: none;
  height: var(--w-4);
  width: var(--h-4);
  border-radius: 50%;
  background: var(--fg);
  cursor: ew-resize;
  box-shadow: none;
  border: none;
  outline: none;
  transition: background 0.3s ease-in-out;
}

input[type="range"]::-ms-thumb {
  appearance: none;
  height: var(--w-4);
  width: var(--h-4);
  border-radius: 50%;
  background: var(--fg);
  cursor: ew-resize;
  box-shadow: none;
  border: none;
  outline: none;
  transition: background 0.2s ease-in-out;
}

input[type="range"]::-webkit-slider-thumb:hover {
  background: var(--gray-300);
}
input[type="range"]::-moz-range-thumb:hover {
  background: var(--gray-300);
}
input[type="range"]::-ms-thumb:hover {
  background: var(--gray-300);
}

/* Input Track */
input[type="range"]::-webkit-slider-runnable-track {
  appearance: none;
  box-shadow: none;
  border: none;
  background: transparent;
}
input[type="range"]::-moz-range-track {
  appearance: none;
  box-shadow: none;
  border: none;
  background: transparent;
}
input[type="range"]::-ms-track {
  appearance: none;
  box-shadow: none;
  border: none;
  background: transparent;
}
.EFormRange :deep(.EInput) {
  margin-left: var(--m-4);
  max-width: 4rem;
}
</style>
