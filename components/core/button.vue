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
        :loading="loading"
        :prepend-icon="prependIcon"
        :append-icon="appendIcon"
        @click="!link ? onClick($event) : false"
      >
        <template v-if="prependIcon && !icon" #prepend>
          <v-icon :color="prependColor"></v-icon>
        </template>

        <span v-if="label && !icon" :class="`text-${textColor}`">{{
          label
        }}</span>
        <template v-else>
          <v-icon :color="iconColor">{{ icon }}</v-icon>
        </template>

        <template v-if="appendIcon && !icon" #append>
          <v-icon :color="appendColor"></v-icon>
        </template>
      </v-btn>
    </template>
  </v-tooltip>
</template>

<script setup>
const props = defineProps({
  appendColor: {
    type: String,
    default: "white",
  },
  appendIcon: {
    type: String,
    default: undefined,
  },
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
  loading: {
    type: Boolean,
    default: false,
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
  prependColor: {
    type: String,
    default: "white",
  },
  prependIcon: {
    type: String,
    default: undefined,
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
