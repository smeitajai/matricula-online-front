<template>
  <v-row class="ma-5">
    <PageTitle title="Processo de Inscrição" />

    <v-col cols="12">
      <CoreList
        :item-text="(i) => i.nome"
        :item-text-sub="(i) => `Edital: ${i.edital}`"
        :items="processos"
        header="Processos Cadastrados"
        toolbar
        @click="onClickItem($event)"
      />
    </v-col>
  </v-row>

  <ProcessoDialog
    :dialog="dialog"
    :processo="dadosProcesso"
    @close="dialog = false"
    @created="onCreate($event)"
    @updated="onUpdate($event)"
  />

  <CoreFloatingButton
    icon="mdi-plus"
    tooltip="Adicionar Processo"
    @click="(dadosProcesso = {}), (dialog = true)"
  />
</template>

<script setup>
const dadosProcesso = ref({});
const dialog = ref(false);

//const { data: processos } = await useGET("processos");
const processos = ref([
  {
    id: 1,
    nome: "Processo 1",
    edital: "16/2023",
    faseInicialDataInicio: "2001-10-05",
    faseInicialDataFim: "2001-10-10",
    faseFinalDataInicio: "2001-10-15",
    faseFinalDataFim: "2001-10-20",
  },
  {
    id: 2,
    nome: "Processo 2",
    edital: "19/2023",
    faseInicialDataInicio: "2001-11-07",
    faseInicialDataFim: "2001-11-14",
    faseFinalDataInicio: "2001-11-18",
    faseFinalDataFim: "2001-11-25",
  },
]);

const onClickItem = (processo) => {
  dadosProcesso.value = { ...processo };
  dialog.value = true;
};

const onCreate = (processo) => {
  processos.value.push(processo.value);
  dialog.value = false;
};

const onUpdate = (processo) => {
  const indexProcesso = processos.value.findIndex(
    (p) => p.id == processo.value.id
  );
  Object.assign(processos.value[indexProcesso], processo.value);
  dialog.value = false;
};
</script>
