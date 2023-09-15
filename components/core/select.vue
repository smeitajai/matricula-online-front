<template>
  <v-col cols="12" class="py-1 px-1" :md="fullWidth ? 12 : 6">
    <v-select
      v-model="value"
      :clearable="clearable"
      :disabled="disabled"
      :item-title="itemTitle"
      :items="items"
      :label="label"
      :rules="validationRules"
      :variant="variant"
      return-object
    />
  </v-col>
</template>

<script setup>
const props = defineProps({
  clearable: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
    default: () => [],
  },
  itemTitle: {
    type: String,
    default: "title",
  },
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number, Object],
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  validate: {
    type: Array,
    default: () => [],
  },
  variant: {
    type: String,
    default: "outlined",
  },
});

const emit = defineEmits(["input"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("input", val);
  },
});

const validationRules = ref([]);

onMounted(() => {
  validationRules.value = props.required
    ? [...props.validate, (v) => !!v || "Campo obrigatório"]
    : [...props.validate];
});
</script>
