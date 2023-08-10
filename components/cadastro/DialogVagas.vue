<template>
  <CoreDialog v-model="showDialog" persistent :title="dialogTitle" toolbar>
    <v-row class="ma-0 text-h6" justify="center">
      <span> Vaga escolhida na</span>
    </v-row>
    <v-row class="mx-0 my-n2 text-h6" justify="center">
      <span>{{ unidade.nome }}</span>
    </v-row>

    <v-container v-if="!turnoSelected" class="pa-0">
      <v-row class="ma-0 py-6 text-body-1" justify="center">
        Escolha o turno desejado:
      </v-row>
      <v-row class="ma-0" justify="space-evenly">
        <CoreButton
          v-for="turno in turnos"
          :key="turno.id"
          :label="turno.nome"
          rounded
          @click="turnoSelected = turno"
        />
      </v-row>
    </v-container>

    <v-container v-else class="pa-0">
      <v-row class="ma-0 pt-6 text-h6 font-weight-bold" justify="center">
        Etapa: {{ etapa.nome }}
      </v-row>
      <v-row class="mx-0 my-n2 pb-6 text-h6 font-weight-bold" justify="center">
        Turno: {{ turnoSelected.nome }}
      </v-row>
      <v-row class="ma-0 text-body-1" justify="center">
        Confirme a vaga escolhida
      </v-row>
      <v-row class="ma-0 pt-2" justify="space-evenly">
        <CoreButton
          label="Confirmar"
          rounded
          prepend-icon="mdi-check"
          @click="emit('confirm', turnoSelected)"
        />
      </v-row>
    </v-container>
    <template #dialogActions>
      <CoreButton
        text-color="red-darken-1"
        label="cancelar"
        variant="text"
        @click="(turnoSelected = null), emit('close')"
      />
    </template>
  </CoreDialog>
</template>

<script setup>
const emit = defineEmits(["confirm", "close"]);
const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  etapa: {
    type: Object,
    default: () => ({}),
  },
  unidade: {
    type: Object,
    default: () => ({}),
  },
});
watch(
  () => props.dialog,
  () => {
    turnoSelected.value = null;
  }
);

const { data: turnos } = await useGET("turnos");
const turnoSelected = ref(null);

const showDialog = computed({
  get() {
    return props.dialog;
  },
  set() {
    emit("close");
  },
});

const dialogTitle = computed(() =>
  turnoSelected.value ? "Confirmar Vaga" : "Escolher Turno"
);
</script>
