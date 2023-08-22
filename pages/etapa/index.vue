<template>
  <v-row class="ma-5">
    <PageTitle title="Etapas" />

    <v-col cols="12">
      <CoreList
        :item-text-sub="(i) => `Ordem: ${i.ordem}`"
        :item-text="(i) => i.nome"
        :items="etapas"
        header="Etapas Cadastradas"
        toolbar
        @click="onClickItem($event)"
      />
    </v-col>
  </v-row>

  <EtapaDialog
    :dialog="dialog"
    :etapa="dadosEtapa"
    @close="dialog = false"
    @created="onCreate($event)"
    @updated="onUpdate($event)"
  />

  <CoreFloatingButton
    icon="mdi-plus"
    tooltip="Adicionar Etapa"
    @click="(dadosEtapa = {}), (dialog = true)"
  />

  <CoreSnackbar
    v-if="etapas.error"
    v-model="etapas.error"
    color="error"
    :message="etapas.message"
  />
</template>

<script setup>
const dadosEtapa = ref({});
const dialog = ref(false);

const { data: etapas } = await useFetch("/api/etapas");

const onClickItem = (etapa) => {
  dadosEtapa.value = { ...etapa };
  dialog.value = true;
};

const onCreate = (etapa) => {
  etapas.value.push(etapa.value);
  dialog.value = false;
};

const onUpdate = (etapa) => {
  const indexEtapa = etapas.value.findIndex((e) => e.id == etapa.value.id);
  Object.assign(etapas.value[indexEtapa], etapa.value);
  dialog.value = false;
};
</script>
