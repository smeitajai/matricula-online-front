<template>
  <v-col cols="12">
    <span class="text-h4">{{ title }}</span>
  </v-col>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>
