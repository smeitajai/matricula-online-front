<template>
  <v-row class="ma-5">
    <PageTitle v-if="unidade" :title="`Quadro de vagas | ${unidade.nome}`" />
    <v-col cols="12">
      <v-table v-if="consolidado.length" fixed-header>
        <thead>
          <tr>
            <th v-for="item in headers" :key="item.id" class="text-center">
              {{ item.nome }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in consolidado" :key="item.id" class="text-center">
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
          </tr>
        </tbody>
      </v-table>
      <span v-else>Nenhum quadro de vagas cadastrado para esta unidade.</span>
    </v-col>
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
</template>

<script setup>
const route = useRoute();
const { data: unidade } = await useGET(`unidades-ensino/${route.query.id}`);
const { data: etapas } = await useGET("etapas");
const { data: turnos } = await useGET("turnos");
//const {data: quadros} = await useGET("quadro-vagas-unidade");

const headers = [
  { id: "1", nome: "Etapa" },
  { id: "2", nome: "Turno" },
  { id: "3", nome: "Vagas" },
  { id: "4", nome: "Ações" },
];

const consolidado = ref([]);

const dialog = ref(false);
const quadroSelected = ref({});

const onClickEdit = (item) => {
  console.log("item :>> ", item);
  quadroSelected.value = item;
  dialog.value = true;
};

const onCreate = (quadro) => {
  dialog.value = false;
  consolidado.value.push(quadro.value);
};

const onUpdate = (quadro) => {
  dialog.value = false;
  const index = consolidado.value.findIndex((i) => i.id === quadro.value.id);
  console.log("index :>> ", index);
  consolidado.value[index] = quadro.value;
  console.log("consolidado.value :>> ", consolidado.value);
};
</script>
