<template>
  <v-chip :color="color" :variant="variant">
    {{ text }}
  </v-chip>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    default: "primary",
  },
  text: {
    type: String,
    default: "",
  },
  variant: {
    type: String,
    default: "outlined",
  },
});
</script>
