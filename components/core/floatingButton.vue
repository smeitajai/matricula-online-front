<template>
  <v-spacer></v-spacer>
  <v-tooltip :text="tooltip">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :color="color"
        :location="location"
        :position="position"
        :size="size"
        :to="link || null"
        class="mr-8 mb-8"
        icon
        @click="onClick"
      >
        <v-icon :color="iconColor">{{ icon }}</v-icon>
      </v-btn>
    </template>
  </v-tooltip>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: "#6200EE", // primary
  },
  icon: {
    type: String,
    default: null,
  },
  iconColor: {
    type: String,
    default: "white",
  },
  link: {
    type: String,
    default: null,
  },
  location: {
    type: String,
    default: "bottom right",
  },
  position: {
    type: String,
    default: "fixed",
  },
  size: {
    type: String,
    default: "x-large",
  },
  tooltip: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["click"]);

const onClick = (event) => {
  emit("click", event);
};
</script>
