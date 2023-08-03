<template>
  <v-row class="ma-5">
    <PageTitle title="Turno" />

    <v-col cols="12" v-if="turnos">
      <CoreList
        :item-text="(i) => i.nome"
        :items="turnos"
        header="Turnos Cadastrados"
        toolbar
        @click="onClickItem($event)"
      />
    </v-col>
  </v-row>

  <TurnoDialog
    :dialog="dialog"
    :turno="dadosTurno"
    @close="dialog = false"
    @created="onCreate($event)"
    @updated="onUpdate($event)"
  />

  <CoreFloatingButton
    icon="mdi-plus"
    tooltip="Adicionar Turno"
    @click="(dadosTurno = {}), (dialog = true)"
  />

  <CoreSnackbar
    v-if="error"
    v-model="error"
    color="error"
    :message="error.message"
  />
</template>

<script setup>
const dadosTurno = ref({});
const dialog = ref(false);

const { data: turnos, error } = await useGET("turnos");

const onClickItem = (turno) => {
  dadosTurno.value = { ...turno };
  dialog.value = true;
};

const onCreate = (turno) => {
  turnos.value.push(turno.value);
  dialog.value = false;
};

const onUpdate = (turno) => {
  const indexTurno = turnos.value.findIndex((t) => t.id == turno.value.id);
  Object.assign(turnos.value[indexTurno], turno.value);
  dialog.value = false;
};
</script>
