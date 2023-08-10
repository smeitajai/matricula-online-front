<template>
  <v-card :elevation="elevation" :rounded="rounded">
    <v-toolbar v-if="toolbar" :color="color" :density="density">
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-toolbar>
    <v-card-title v-if="!toolbar && title">
      {{ title }}
    </v-card-title>
    <v-card-text :class="[{ 'pa-0': paddingNone }]">
      <slot />
    </v-card-text>
    <v-card-actions v-if="slots.actions">
      <v-spacer></v-spacer>
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script setup>
const slots = useSlots();

defineProps({
  actions: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: "primary",
  },
  density: {
    type: String,
    default: "compact",
  },
  elevation: {
    type: Number,
    default: 10,
  },
  paddingNone: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: [String, Number, Boolean],
    default: false,
  },
  title: {
    type: String,
    default: null,
  },
  toolbar: {
    type: Boolean,
    default: false,
  },
});
</script>
