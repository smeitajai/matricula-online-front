<template>
  <v-col cols="12" class="py-1 px-1" :md="fullWidth ? 12 : 6">
    <v-text-field
      v-model="value"
      :append-inner-icon="appendInnerIcon"
      :autofocus="autofocus"
      :clearable="clearable"
      :counter="counter"
      :hint="hint"
      :label="label"
      :persistent-hint="persistentHint"
      :placeholder="placeholder"
      :rules="validationRules"
      :type="type"
      :variant="variant"
      @click:append-inner="appendInnerClick"
    />
  </v-col>
</template>

<script setup>
const props = defineProps({
  appendInnerIcon: {
    type: String,
    default: null,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  counter: {
    type: Number,
    default: 0,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  hint: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  persistentHint: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "text",
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

const emit = defineEmits(["input", "append-inner-click"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    if (props.type == "number") {
      emit("input", parseInt(val));
    } else {
      emit("input", val);
    }
  },
});

const validationRules = ref([]);

const appendInnerClick = () => {
  emit("append-inner-click");
};

onMounted(() => {
  validationRules.value = props.required
    ? [...props.validate, (v) => !!v || "Campo obrigatório"]
    : [...props.validate];
});
</script>
