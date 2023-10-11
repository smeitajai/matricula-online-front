<template>
  <CoreCard rounded="lg" title="Matrícula On-line" toolbar>
    <v-row>
      <span class="text-h6 ma-5 text-center">
        Seja bem-vindo(a) ao novo sistema de Matrículas On-line para o ensino
        fundamental do município de Itajaí/SC!
      </span>
    </v-row>

    <v-row>
      <span class="mx-5">
        Com apenas alguns cliques, você pode realizar o processo de forma
        simples e segura.
      </span>
    </v-row>

    <v-row v-if="showDates" class="my-8 pl-5">
      <v-col cols="12" class="pa-0"> Datas Importantes: </v-col>
      <v-col
        v-for="etapa in processo.processoEtapas"
        :key="etapa.id"
        cols="12"
        class="pa-0"
      >
        <span :class="[{ 'font-weight-bold': etapa.emAndamento }]">
          {{ etapa.nome }}:
          {{ formatarData(etapa.faseInicialDataInicio) }}
          até
          {{ formatarData(etapa.faseFinalDataFim) }}
        </span>
      </v-col>
    </v-row>

    <v-row>
      <a
        href="https://drive.google.com/file/d/1C6uFVd71HnQxWkg8czDpsYFu5Mk5poLM/view"
        target="_blank"
        class="text-h5 mx-5 pb-5"
        >Clique aqui para acessar o edital de matrícula {{ anoEdital }}</a
      >
    </v-row>
  </CoreCard>
  <v-col cols="12" class="mt-5">
    <v-row justify="center">
      <CoreButton
        v-if="showBtn"
        label="clique aqui para começar"
        link="/cadastro"
        rounded="xl"
        size="x-large"
      />
    </v-row>
  </v-col>

  <CoreSnackbar
    v-model="showMessage"
    color="error"
    :message="message"
    @hide="showMessage = $event"
  />
</template>

<script setup>
import { format, utcToZonedTime } from "date-fns-tz";

const { data: processo, error: errorProcesso } = await useFetch(
  "/api/processos/em-andamento",
);

const anoEdital = new Date().getFullYear() + 1;
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

  showBtn.value = true;
});

const formatarData = (data) => {
  const dataTimeZoned = utcToZonedTime(data, "-00:00"); //Ignora o timezone, mantendo a data correta
  return format(dataTimeZoned, "dd/MM/yyyy");
};
</script>
