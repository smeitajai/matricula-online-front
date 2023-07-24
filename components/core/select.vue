<template>
  <v-col cols="12" class="py-0 px-1" :md="fullWidth ? 12 : 6">
    <v-select
      v-model="value"
      :clearable="clearable"
      :items="items"
      :label="label"
      :rules="validationRules"
      :variant="variant"
    />
  </v-col>
</template>

<script setup>
const props = defineProps({
  clearable: {
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
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number],
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
