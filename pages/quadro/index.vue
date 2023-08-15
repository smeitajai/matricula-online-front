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
    <v-col v-if="error">
      {{ error }}
    </v-col>
  </v-row>
</template>

<script setup>
//const router = useRouter();
const { data: unidades, error } = useGET("unidades-ensino");

const onClickItem = async (unidade) => {
  // router.push({
  //   path: "/quadro/unidade",
  //   query: {
  //     id: unidade.id,
  //   },
  // });
  await navigateTo({
    path: "/quadro/unidade",
    query: {
      id: unidade.id,
    },
  });
};
</script>
