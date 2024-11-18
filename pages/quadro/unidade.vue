<template>
  <v-row class="ma-5">
    <PageTitle v-if="unidade" :title="`Quadro de vagas | ${unidade.nome}`" />
    <CoreTable :headers="headers" :items="quadrosCarregados">
      <template #body="{ item }">
        <td>{{ item.nome }}</td>
        <td>{{ item.quantidadeVaga }}</td>
        <td>
          <CoreButton
            icon="mdi-pencil"
            :icon-color="
              theme.global.name.value === 'customLightTheme'
                ? 'primary'
                : 'white'
            "
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
    :processo="processo"
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
import { useTheme } from "vuetify";
const theme = useTheme();
const route = useRoute();
const { data: processo } = await useFetch("/api/processos/em-andamento");
const { data: unidade } = await useFetch(
  `/api/unidades/${route.query.unidade}`,
);
const { data: etapas } = await useFetch("/api/etapas");
const { data: turnos } = await useFetch("/api/turnos");
const { data: quadros } = await useFetch("/api/quadros-vaga", {
  query: {
    unidadeEnsino: route.query.unidade,
    //processo: processo.value.id,
  },
});

const headers = ["Nome", "Vagas", "Ações"];
const dialog = ref(false);
const quadrosCarregados = ref([]);
const quadroSelected = ref({});

onMounted(() => {
  quadrosCarregados.value = quadros.value.filter(
    (q) => q.processoId == processo.value.id,
  );
});

const onClickEdit = (item) => {
  quadroSelected.value = item;
  dialog.value = true;
};

const onCreate = (quadro) => {
  dialog.value = false;
  quadrosCarregados.value.push(quadro.value);
};

const onUpdate = (quadro) => {
  dialog.value = false;
  const index = quadrosCarregados.value.findIndex(
    (item) => item.id === quadro.value.id,
  );
  quadrosCarregados.value[index] = quadro.value;
};
</script>
