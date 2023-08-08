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

      <CoreFormSubtitle label="Fase Inicial" class="pt-0" />
      <CoreInput
        v-model="dadosProcesso.faseInicialDataInicio"
        label="Data Inicial*"
        type="date"
        required
        @input="dadosProcesso.faseInicialDataInicio = $event"
      />
      <CoreInput
        v-model="dadosProcesso.faseInicialDataFim"
        label="Data Final*"
        type="date"
        required
        @input="dadosProcesso.faseInicialDataFim = $event"
      />

      <CoreFormSubtitle label="Fase Final" class="pt-0" />
      <CoreInput
        v-model="dadosProcesso.faseFinalDataInicio"
        label="Data Inicial*"
        type="date"
        required
        @input="dadosProcesso.faseFinalDataInicio = $event"
      />
      <CoreInput
        v-model="dadosProcesso.faseFinalDataFim"
        label="Data Final*"
        type="date"
        required
        @input="dadosProcesso.faseFinalDataFim = $event"
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
  }
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
