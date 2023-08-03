<template>
  <v-row class="ma-5">
    <PageTitle title="Unidades de Ensino" />

    <v-col cols="12">
      <CoreList
        :item-text-sub="(i) => `ID: ${i.idExterno}`"
        :item-text="(i) => i.nome"
        :items="unidades"
        header="Unidades Cadastradas"
        toolbar
        @click="onClickItem($event)"
      />
    </v-col>
  </v-row>

  <UnidadesDialog
    :dialog="dialog"
    :unidade="dadosUnidade"
    @close="dialog = false"
    @created="onCreate($event)"
    @updated="onUpdate($event)"
  />

  <CoreFloatingButton
    icon="mdi-plus"
    tooltip="Adicionar Unidade"
    @click="(dadosUnidade = {}), (dialog = true)"
  />
</template>

<script setup>
const dadosUnidade = ref({});
const dialog = ref(false);

const { data: unidades, pending, error, refresh } = await useGET("unidades-ensino");

const onClickItem = (unidade) => {
  dadosUnidade.value = { ...unidade };
  dialog.value = true;
};

const onCreate = (unidade) => {
  unidades.value.push(unidade.value);
  dialog.value = false;
};

const onUpdate = (unidade) => {
  const indexUnidade = unidades.value.findIndex(
    (u) => u.id == unidade.value.id
  );
  Object.assign(unidades.value[indexUnidade], unidade.value);
  dialog.value = false;
};
</script>
