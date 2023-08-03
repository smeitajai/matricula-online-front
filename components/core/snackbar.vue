<template>
  <v-snackbar
    v-model="value"
    :color="color"
    :location="location"
    :rounded="rounded"
    :timeout="timeout"
    :transition="transition"
    class="mr-5"
  >
    {{ message }}
  </v-snackbar>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    default: undefined,
  },
  location: {
    type: String,
    default: "right top",
  },
  message: {
    type: [String, Error],
    default: "",
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: String,
    default: "xl",
  },
  timeout: {
    type: [String, Number],
    default: 5000,
  },
  transition: {
    type: String,
    default: "fab-transition",
  },
});

const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>
