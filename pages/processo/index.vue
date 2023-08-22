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

  <CoreSnackbar
    v-if="processos.error"
    v-model="processos.error"
    color="error"
    :message="processos.message"
  />
</template>

<script setup>
const dadosProcesso = ref({});
const dialog = ref(false);

const { data: processos } = await useFetch("/api/processos");

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
