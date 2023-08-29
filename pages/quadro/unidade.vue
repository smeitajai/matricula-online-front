<template>
  <v-row class="ma-5">
    <PageTitle v-if="unidade" :title="`Quadro de vagas | ${unidade.nome}`" />
    <CoreTable :headers="headers" :items="quadros">
      <template #body="{ item }">
        <td>{{ item.etapa.nome }}</td>
        <td>{{ item.turno.nome }}</td>
        <td>{{ item.quantidadeVaga }}</td>
        <td>
          <CoreButton
            icon="mdi-pencil"
            icon-color="primary"
            tooltip="Editar Vagas"
            variant="text"
            @click="onClickEdit(item)"
          />
        </td>
      </template>
    </CoreTable>
  </v-row>

  <QuadroDialog
    v-if="dialog"
    :dialog="dialog"
    :etapas="etapas"
    :quadro="quadroSelected"
    :turnos="turnos"
    :unidade="unidade"
    @close="dialog = false"
    @created="onCreate($event)"
    @updated="onUpdate($event)"
  />

  <CoreFloatingButton
    icon="mdi-plus"
    tooltip="Adicionar Quadro"
    @click="(quadroSelected = {}), (dialog = true)"
  />

  <CoreSnackbar
    v-if="quadros.error"
    v-model="quadros.error"
    color="error"
    :message="quadros.message"
  />
</template>

<script setup>
const route = useRoute();
const { data: unidade } = await useFetch(`/api/unidades/${route.query.id}`);
const { data: etapas } = await useFetch("/api/etapas");
const { data: turnos } = await useFetch("/api/turnos");
const { data: quadros } = await useFetch("/api/quadros-vaga", {
  query: {
    unidadeEnsino: route.query.id,
  },
});

const headers = ["Etapa", "Turno", "Vagas", "Ações"];
const dialog = ref(false);
const quadroSelected = ref({});

const onClickEdit = (item) => {
  quadroSelected.value = item;
  dialog.value = true;
};

const onCreate = (quadro) => {
  dialog.value = false;
  quadros.value.push(quadro.value);
};

const onUpdate = (quadro) => {
  dialog.value = false;
  const index = quadros.value.findIndex((item) => item.id === quadro.value.id);
  quadros.value[index] = quadro.value;
};
</script>
