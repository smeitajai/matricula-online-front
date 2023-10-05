<template>
  <v-row class="ma-5">
    <PageTitle title="Quadro de Vagas" />

    <v-col v-if="unidades" cols="12">
      <CoreInput
        v-model="textFilter"
        clearable
        full-width
        label="Filtrar Unidade"
        placeholder="Ex: Aníbal César"
        @input="(textFilter = $event), onInputFilter()"
      />
      <CoreList
        :item-text="(i) => i.nome"
        :items="unidadesFiltradas"
        header="Selecione a Unidade"
        toolbar
        @click="onClickItem($event)"
      />
    </v-col>
  </v-row>

  <CoreSnackbar
    v-if="unidades.error"
    v-model="unidades.error"
    color="error"
    :message="unidades.message"
  />
</template>

<script setup>
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

const onClickItem = async (unidade) => {
  await navigateTo({
    path: "/quadro/unidade",
    query: {
      id: unidade.id,
    },
  });
};
</script>
