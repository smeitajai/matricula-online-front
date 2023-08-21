<template>
  <v-row class="ma-5">
    <PageTitle title="Quadro de Vagas" />

    <v-col v-if="unidades" cols="12">
      <CoreList
        :item-text="(i) => i.nome"
        :items="unidades"
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

const onClickItem = async (unidade) => {
  await navigateTo({
    path: "/quadro/unidade",
    query: {
      id: unidade.id,
    },
  });
};
</script>
