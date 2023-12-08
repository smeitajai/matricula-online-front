<template>
  <CoreCard rounded="lg" title="Matrícula On-line" toolbar class="ma-5">
    <v-row>
      <span class="text-h6 ma-5 text-center">
        Seja bem-vindo(a) ao novo Sistema de Matrículas On-line para o
        <u>Ensino Fundamental</u> do Município de Itajaí/SC!
      </span>
    </v-row>

    <v-row v-if="showDates" class="my-5 pl-5">
      <v-col cols="12" class="pa-0 font-weight-bold">
        Datas Importantes:
      </v-col>
      <v-col
        v-for="etapa in processo.processoEtapas"
        :key="etapa.id"
        cols="12"
        class="py-2"
      >
        <span :class="[{ 'font-weight-bold': etapa.emAndamento }]">
          {{ etapa.nome }}: {{ formatarData(etapa.faseInicialDataInicio) }} -
          {{ utcToSaoPauloTime(etapa.faseInicialDataInicio) }}h até
          {{ formatarData(etapa.faseInicialDataFim) }} -
          {{ utcToSaoPauloTime(etapa.faseInicialDataFim) }}h
        </span>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <CoreButton
          block
          href="https://drive.google.com/file/d/1_f3Hueg2Ot0T45qDk3uPFoOBGKYgxsEY/view?usp=sharing"
          label="Edital de Matrícula 2024"
          prepend-color="primary"
          prepend-icon="mdi-file-document"
          target="_blank"
          text-color="primary"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" md="6">
        <CoreButton
          block
          href="https://drive.google.com/file/d/1iwDpUqgXzmE8CJfgluzu7QPmHHM2-M27/view?usp=sharing"
          label="Manual de Uso"
          prepend-color="primary"
          prepend-icon="mdi-file-document"
          target="_blank"
          text-color="primary"
          variant="outlined"
        />
      </v-col>
    </v-row>
    <v-row justify="center" class="py-4">
      <CoreButton
        v-if="showBtn"
        label="clique aqui para começar"
        link="/cadastro"
        rounded="xl"
        size="x-large"
      />
    </v-row>
  </CoreCard>

  <CoreSnackbar
    v-model="showMessage"
    color="error"
    :message="message"
    @hide="showMessage = $event"
  />
</template>

<script setup>
import { getHours } from "date-fns";
import { format, utcToZonedTime } from "date-fns-tz";

const { data: processo, error: errorProcesso } = await useFetch(
  "/api/processos/em-andamento",
);

const showMessage = ref(false);
const message = ref("");
const showBtn = ref(false);
const showDates = computed(() => {
  return (
    processo.value &&
    processo.value.processoEtapas &&
    processo.value.processoEtapas.length
  );
});

onMounted(() => {
  if (errorProcesso.value || (processo.value && processo.value.error)) {
    errorProcesso.value
      ? (message.value = errorProcesso.value.message)
      : (message.value = processos.value.message);
    return (showMessage.value = true);
  }

  if (!processo.value.id) {
    message.value = "Nenhum processo ativo no momento";
    return (showMessage.value = true);
  }

  if (!processo.value.processoEtapas.length) {
    message.value = "Nenhuma etapa de inscrição cadastrada";
    return (showMessage.value = true);
  }

  const etapaEmAndamento = processo.value.processoEtapas.some(
    (etapa) => etapa.emAndamento,
  );
  if (!etapaEmAndamento) {
    message.value = "Nenhuma etapa em andamento";
    return (showMessage.value = true);
  }

  showBtn.value = true;
});

const formatarData = (data) => {
  const dataTimeZoned = utcToZonedTime(data, "-00:00"); //Ignora o timezone, mantendo a data correta
  return format(dataTimeZoned, "dd/MM/yyyy");
};

const utcToSaoPauloTime = (data) => {
  const dataSaoPaulo = utcToZonedTime(data, "-00:00"); //Ignora o timezone, mantendo a hora correta
  return getHours(dataSaoPaulo);
};
</script>
