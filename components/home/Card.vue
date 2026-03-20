<template>
  <CoreCard rounded="lg" title="Matrícula On-line" toolbar class="ma-5">
    <v-row>
      <span class="text-h6 ma-5 text-center">
        Seja bem-vindo(a) ao sistema de matrículas On-line para o
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
          {{ etapa.nome }}: {{ getDate(etapa.faseInicialDataInicio) }} ({{
            getHour(etapa.faseInicialDataInicio)
          }}h) até {{ getDate(etapa.faseInicialDataFim) }} ({{
            getHour(etapa.faseInicialDataFim)
          }}h)
        </span>
      </v-col>
    </v-row>
    <v-row v-if="showBtn" class="pt-4 px-4">
      <v-col cols="12" justify="center" class="py-2" v-for="p in processo" :key="processo.id">
        <CoreButton
          :label="p.nome"
          :link="'/cadastro?tipo=' + p.id"
          rounded="xl"
          size="x-large"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <CoreButton
          :color="themeColor"
          :prepend-color="themeColor"
          :text-color="themeColor"
          block
          href="https://drive.google.com/file/d/1Bcfkov-puyI8xD5V04FhQBXXM6US76j6"
          label="Edital de Matrícula 2026"
          prepend-icon="mdi-file-document"
          target="_blank"
          variant="outlined"
        />
      </v-col>
      <!-- <v-col cols="12" md="6">
        <CoreButton
          :color="themeColor"
          :prepend-color="themeColor"
          :text-color="themeColor"
          block
          href="https://drive.google.com/file/d/1iwDpUqgXzmE8CJfgluzu7QPmHHM2-M27"
          label="Manual de Uso"
          prepend-icon="mdi-file-document"
          target="_blank"
          variant="outlined"
        />
      </v-col> -->
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
import { format, utcToZonedTime } from "date-fns-tz";
import { useTheme } from "vuetify";
const theme = useTheme();

const { data: processo, error: errorProcesso } = await useFetch(
  "/api/processos/",
);

const showMessage = ref(false);
const message = ref("");
const showBtn = ref(true);
const tipoCadastroSelecionado = ref(null);
const showDates = computed(() => {
  return (
    processo.value &&
    processo.value.processoEtapas &&
    processo.value.processoEtapas.length
  );
});
const themeColor = computed(() => {
  return theme.global.name.value === "customLightTheme" ? "primary" : "white";
});
const linkCadastro = computed(() => {
  if (!tipoCadastroSelecionado.value) return null;

  return `/cadastro?tipo=${tipoCadastroSelecionado.value.id}`;
});

onMounted(() => {
  if (errorProcesso.value || (processo.value && processo.value.error)) {
    errorProcesso.value
      ? (message.value = errorProcesso.value.message)
      : (message.value = processos.value.message);
    return (showMessage.value = true);
  }

  showBtn.value = true;
});

const getDate = (data) => {
  const utcDate = utcToZonedTime(data, "UTC");
  return format(utcDate, "dd/MM/yyyy", { timeZone: "UTC" });
};

const getHour = (data) => {
  const utcDate = utcToZonedTime(data, "UTC");
  return format(utcDate, "HH", { timeZone: "UTC" });
};
</script>
