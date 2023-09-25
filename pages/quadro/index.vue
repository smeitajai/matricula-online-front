<template>
  <v-row class="ma-5">
    <PageTitle title="Quadro de Vagas" />

    <v-col v-if="unidades" cols="12">
      <CoreInput
        append-inner-icon="mdi-magnify"
        full-width
        label="Filtrar Unidade"
        @input="onInputFilter($event)"
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

onMounted(() => {
  unidadesFiltradas.value = unidades.value;
});

const onInputFilter = (textoFilter) => {
  unidadesFiltradas.value = unidades.value.filter((unidade) => {
    return new RegExp(textoFilter.toUpperCase()).test(unidade.nome);
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
