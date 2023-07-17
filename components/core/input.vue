<template>
  <v-col cols="12" class="py-0 px-1" :md="fullWidth ? 12 : 6">
    <v-text-field
      v-model="value"
      :autofocus="autofocus"
      :clearable="clearable"
      :counter="counter"
      :hint="hint"
      :label="label"
      :persistent-hint="persistentHint"
      :placeholder="placeholder"
      :type="type"
      :variant="variant"
    />
  </v-col>
</template>

<script setup>
const props = defineProps({
  autofocus: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  counter: {
    type: Number,
    default: 0,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  hint: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
    default: "",
  },
  persistentHint: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  variant: {
    type: String,
    default: "outlined",
  },
});

const emit = defineEmits(["input"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("input", val);
  },
});
</script>
