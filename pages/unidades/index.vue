<template>
  <v-row class="ma-5">
    <PageTitle title="Unidades de Ensino" />

    <v-col cols="12">
      <CoreInput
        v-model="textFilter"
        clearable
        full-width
        label="Filtrar Unidade"
        placeholder="Ex: Aníbal César"
        @input="(textFilter = $event), onInputFilter()"
      />
      <CoreList
        :item-text-sub="(i) => `ID: ${i.idExterno}`"
        :item-text="(i) => i.nome"
        :items="unidadesFiltradas"
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

  <CoreSnackbar
    v-if="unidades.error"
    v-model="unidades.error"
    color="error"
    :message="unidades.message"
  />
</template>

<script setup>
const dadosUnidade = ref({});
const dialog = ref(false);

const { data: unidades } = await useFetch("/api/unidades");
const unidadesFiltradas = ref([]);
const textFilter = ref(null);

onMounted(() => {
  unidadesFiltradas.value = unidades.value;
});

const onInputFilter = () => {
  unidadesFiltradas.value = unidades.value.filter((unidade) => {
    return new RegExp(textFilter.value.toUpperCase()).test(
      unidade.nome.toUpperCase(),
    );
  });
};

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
    (u) => u.id == unidade.value.id,
  );
  Object.assign(unidades.value[indexUnidade], unidade.value);
  dialog.value = false;
};
</script>
