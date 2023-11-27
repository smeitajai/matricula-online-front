<template>
  <v-row class="ma-5">
    <PageTitle
      v-if="processo"
      :title="`Etapas do Processo | ${processo.nome}`"
    />
    <v-col cols="12">
      <CoreList
        :item-text="(e) => e.nome"
        :item-text-sub="
          (e) =>
            `Início: ${formatarData(
              e.faseInicialDataInicio,
            )} | Fim: ${formatarData(e.faseFinalDataFim)}`
        "
        :items="etapasProcesso"
        header="Etapas Cadastradas"
        toolbar
        @click="onClickItem($event)"
      />
    </v-col>
  </v-row>

  <ProcessoEtapaDialog
    :dialog="dialog"
    :etapa="etapaSelected"
    :processo="processo"
    @close="dialog = false"
    @created="onCreate($event)"
    @updated="onUpdate($event)"
  />

  <CoreFloatingButton
    icon="mdi-plus"
    tooltip="Adicionar Etapa"
    @click="(etapaSelected = {}), (dialog = true)"
  />

  <CoreSnackbar
    v-model="showMessage"
    color="error"
    :message="message"
    @hide="showMessage = $event"
  />
</template>

<script setup>
import { format, utcToZonedTime } from "date-fns-tz";

const route = useRoute();
const { data: processo, error: errorProcesso } = await useFetch(
  `/api/processos/${route.query.processo}`,
);
const { data: etapasProcesso, error: errorEtapas } = await useFetch(
  "/api/processo-etapas",
  {
    query: {
      // Esse filtro ainda não funciona
      processoId: route.query.processo,
    },
  },
);

//Filtro Paliativo para exibir apenas as etapas do processo selecionado
if (etapasProcesso.value) {
  etapasProcesso.value = etapasProcesso.value.filter(
    (e) => e.processoId == processo.value.id,
  );
}

const showMessage = ref(false);
const message = ref("");
const dialog = ref(false);
const etapaSelected = ref({});

onMounted(() => {
  if (errorProcesso.value || (processo.value && processo.value.error)) {
    errorProcesso.value
      ? (message.value = errorProcesso.value.message)
      : (message.value = processo.value.message);
    return (showMessage.value = true);
  }

  if (
    errorEtapas.value ||
    (etapasProcesso.value && etapasProcesso.value.error)
  ) {
    errorEtapas.value
      ? (message.value = errorEtapas.value.message)
      : (message.value = etapasProcesso.value.message);
    return (showMessage.value = true);
  }
});

const onClickItem = (item) => {
  etapaSelected.value = item;
  dialog.value = true;
};

const onCreate = (etapa) => {
  etapasProcesso.value.push(etapa.value);
  dialog.value = false;
};

const onUpdate = (etapa) => {
  const indexEtapa = etapasProcesso.value.findIndex(
    (item) => item.id === etapa.value.id,
  );
  etapasProcesso.value[indexEtapa] = etapa.value;
  dialog.value = false;
};

const formatarData = (data) => {
  //utcToZonedTime(date, 'America/Sao_Paulo') -- Backend
  const dataTimeZoned = utcToZonedTime(data, "-00:00"); //Ignora o timezone, mantendo a data correta
  return format(dataTimeZoned, "dd/MM/yyyy");
};
</script>
