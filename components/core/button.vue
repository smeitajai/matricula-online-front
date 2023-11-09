<template>
  <v-tooltip :text="tooltip" location="top" :disabled="hideTooltip()">
    <template #activator="{ props }">
      <v-btn
        :id="id"
        v-bind="props"
        :append-icon="appendIcon"
        :block="block"
        :color="color"
        :disabled="disabled"
        :href="href"
        :loading="loading"
        :prepend-icon="prependIcon"
        :rounded="rounded"
        :size="size"
        :target="target"
        :to="link || null"
        :variant="variant"
        @click="!link ? onClick($event) : false"
      >
        <template v-if="prependIcon && !icon" #prepend>
          <v-icon :color="prependColor"></v-icon>
        </template>

        <span v-if="label && !icon" :class="`text-${textColor} text-button`">{{
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
  block: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: "#6200EE", // primary
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  href: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  iconColor: {
    type: String,
    default: "white",
  },
  id: {
    type: String,
    default: "",
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
  target: {
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
