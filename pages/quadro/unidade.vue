<template>
  <v-row class="ma-5">
    <PageTitle v-if="unidade" :title="`Quadro de vagas | ${unidade.nome}`" />
    <v-col cols="12">
      <v-table fixed-header>
        <thead>
          <tr>
            <th v-for="turno in turnos" :key="turno.id" class="text-center">
              {{ turno.nome }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in consolidado" :key="item.id" class="text-center">
            <td>{{ item.nome }}</td>
            <td>{{ item.matutino }}</td>
            <td>{{ item.vespertino }}</td>
            <td>{{ item.noturno }}</td>
            <td>
              <CoreButton
                icon="mdi-pencil"
                tooltip="Editar Vagas"
                @click="onClickEdit(item)"
              />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>

  <QuadroDialog
    :dialog="dialog"
    :etapa="etapaSelected"
    @close="dialog = false"
    @updated="onUpdate($event)"
  />
</template>

<script setup>
const route = useRoute();
const { data: unidade } = await useGET(`unidades-ensino/${route.query.id}`);
const { data: etapas } = await useGET("etapas");
//const { data: turnos } = await useGET("turnos");

const dialog = ref(false);
const etapaSelected = ref({});

const consolidado = computed(() => {
  return (
    etapas.value &&
    etapas.value.map((item) => {
      return {
        id: item.id,
        matutino: Math.floor(Math.random() * 30),
        nome: item.nome,
        noturno: Math.floor(Math.random() * 30),
        vespertino: Math.floor(Math.random() * 30),
      };
    })
  );
});

const turnos = ref([
  { id: "1", nome: "Etapa" },
  { id: "2", nome: "Matutino" },
  { id: "3", nome: "Vespertino" },
  { id: "4", nome: "Noturno" },
  { id: "5", nome: "Ações" },
]);

const onClickEdit = (item) => {
  console.log("item :>> ", item);
  etapaSelected.value = item;
  dialog.value = true;
};
</script>
