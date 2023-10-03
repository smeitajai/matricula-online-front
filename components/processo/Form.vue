<template>
  <v-form ref="form">
    <v-row class="ma-0">
      <CoreInput
        v-model="dadosProcesso.nome"
        clearable
        label="Nome*"
        required
        @input="dadosProcesso.nome = $event"
      />
      <CoreInput
        v-model="dadosProcesso.edital"
        clearable
        label="Edital"
        @input="dadosProcesso.edital = $event"
      />
    </v-row>
  </v-form>
</template>

<script setup>
const form = ref(null);

const emit = defineEmits(["input", "valid"]);

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  validate: {
    type: Boolean,
    default: false,
  },
});

watch(
  () => props.validate,
  async () => {
    const { valid } = await form.value.validate();
    emit("valid", valid);
  },
);

const dadosProcesso = computed({
  get() {
    return props.modelValue;
  },
  set(dadosForm) {
    emit("input", dadosForm);
  },
});
</script>
