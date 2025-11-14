<template>
  <v-col cols="12" class="py-1 px-1" :md="fullWidth ? 12 : 6">
    <v-file-input
      v-model="model"
      :accept="accept"
      :chips="chips"
      :clearable="clearable"
      :counter="counter"
      :label="label"
      :multiple="multiple"
      :rules="validationRules"
      :variant="variant"
    ></v-file-input>
  </v-col>
</template>

<script setup>
const props = defineProps({
  accept: {
    type: String,
    default: "image/*, .pdf",
  },
  chips: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  counter: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [Array, File],
    default: () => [],
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

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const validationRules = ref([]);

onMounted(() => {
  validationRules.value = props.required
    ? [
        ...props.validate,
        (v) => {
          if (!v) return "Campo obrigatório";

          // Quando 'multiple' for false
          if (typeof v === "object" && "length" in v) {
            return v.length > 0 || "Campo obrigatório";
          }

          // Quando 'multiple' for true
          if (Array.isArray(v)) {
            return v.length > 0 || "Campo obrigatório";
          }

          return "Campo obrigatório";
        },
      ]
    : [...props.validate];
});
</script>
