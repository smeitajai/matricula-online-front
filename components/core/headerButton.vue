<template>
  <v-tooltip :text="text" location="top">
    <template #activator="{ props }">
      <v-btn v-bind="props" :icon="icon" @click="onClick"></v-btn>
    </template>
  </v-tooltip>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: null,
  },
  text: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["click"]);

const onClick = (event) => {
  emit("click", event);
};
</script>
