<template>
  <v-tooltip :text="tooltip" location="top" :disabled="hideTooltip()">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :color="color"
        :rounded="rounded"
        :size="size"
        :variant="variant"
        :to="link || null"
        @click="!link ? onClick($event) : false"
      >
        <v-icon v-if="icon" :color="iconColor" :left="label != null">{{
          icon
        }}</v-icon>
        <span :class="`text-${textColor}`">{{ label }}</span>
      </v-btn>
    </template>
  </v-tooltip>
</template>

<script setup>
const props = defineProps({
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
  label: {
    type: String,
    default: null,
  },
  rounded: {
    type: String,
    default: "false",
  },
  size: {
    type: String,
    default: "default",
  },
  textColor: {
    type: String,
    default: "white",
  },
  tooltip: {
    type: String,
    default: null,
  },
  link: {
    type: String,
    default: null,
  },
  variant: {
    type: String,
    default: "elevated",
  },
});

const hideTooltip = () => {
  return !props.tooltip ? true : false;
};

const emit = defineEmits(["click"]);

const onClick = (event) => {
  emit("click", event);
};
</script>
