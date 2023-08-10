<template>
  <v-row justify="center">
    <v-dialog
      v-model="value"
      :persistent="persistent"
      :height="height"
      :width="width"
      :transition="transition"
    >
      <CoreCard :title="title" :toolbar="toolbar">
        <slot />
        <template v-if="slots.dialogActions" #actions>
          <slot name="dialogActions" />
        </template>
      </CoreCard>
    </v-dialog>
  </v-row>
</template>

<script setup>
const slots = useSlots();

const props = defineProps({
  height: {
    type: [String, Number],
    default: undefined,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  persistent: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  toolbar: {
    type: Boolean,
    default: false,
  },
  transition: {
    type: String,
    default: "slide-y-transition",
  },
  width: {
    type: [String, Number],
    default: 720,
  },
});

const emit = defineEmits(["close"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("close", val);
  },
});
</script>
