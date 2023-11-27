<template>
  <v-form ref="form">
    <v-row class="ma-0">
      <CoreInput
        v-model="dadosEtapa.nome"
        label="Nome*"
        required
        @input="dadosEtapa.nome = $event"
      />
      <CoreSelect
        v-model="dadosEtapa.tipo"
        label="Tipo*"
        :items="tipos"
        required
        @input="dadosEtapa.tipo = $event"
      />
      <CoreFormSubtitle label="Fase Inicial" class="pt-0" />
      <CoreInput
        v-model="dadosEtapa.faseInicialDataInicio"
        label="Data Inicial*"
        type="date"
        required
        @input="dadosEtapa.faseInicialDataInicio = $event"
      />
      <CoreInput
        v-model="dadosEtapa.faseInicialDataFim"
        label="Data Final*"
        type="date"
        required
        @input="dadosEtapa.faseInicialDataFim = $event"
      />

      <CoreFormSubtitle label="Fase Final" class="pt-0" />
      <CoreInput
        v-model="dadosEtapa.faseFinalDataInicio"
        label="Data Inicial*"
        type="date"
        required
        @input="dadosEtapa.faseFinalDataInicio = $event"
      />
      <CoreInput
        v-model="dadosEtapa.faseFinalDataFim"
        label="Data Final*"
        type="date"
        required
        @input="dadosEtapa.faseFinalDataFim = $event"
      />
    </v-row>
  </v-form>
</template>

<script setup>
import { format, utcToZonedTime } from "date-fns-tz";

const form = ref(null);
const tipos = ref(["MATRICULA", "TRANSFERENCIA"]);

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

onMounted(() => {
  if (props.modelValue.id) {
    formatData(dadosEtapa.value);
  }
});

const dadosEtapa = computed({
  get() {
    return props.modelValue;
  },
  set(dadosForm) {
    emit("input", dadosForm);
  },
});

const formatData = (etapa) => {
  // "-00:00" Ignora o timezone, mantendo a data correta
  etapa.faseInicialDataInicio = format(
    utcToZonedTime(etapa.faseInicialDataInicio, "-00:00"),
    "yyyy-MM-dd",
  );
  etapa.faseInicialDataFim = format(
    utcToZonedTime(etapa.faseInicialDataFim, "-00:00"),
    "yyyy-MM-dd",
  );
  etapa.faseFinalDataInicio = format(
    utcToZonedTime(etapa.faseFinalDataInicio, "-00:00"),
    "yyyy-MM-dd",
  );
  etapa.faseFinalDataFim = format(
    utcToZonedTime(etapa.faseFinalDataFim, "-00:00"),
    "yyyy-MM-dd",
  );
};
</script>
