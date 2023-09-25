<template>
  <CoreDialog v-model="showDialog" persistent title="Confirmar Vaga" toolbar>
    <v-row class="ma-0 text-h6" justify="center">
      <span> Vaga escolhida na</span>
    </v-row>
    <v-row class="mx-0 my-n2 text-h6" justify="center">
      <span>{{ unidade.nome }}</span>
    </v-row>

    <v-container class="pa-0">
      <v-row class="ma-0 py-6 text-h6 font-weight-bold" justify="center">
        Etapa/Turno: {{ quadro.nome }}
      </v-row>
      <v-row class="ma-0 text-body-1" justify="center">
        Confirme a vaga escolhida
      </v-row>
      <v-row class="ma-0 pt-2" justify="space-evenly">
        <CoreButton
          label="Confirmar"
          rounded
          prepend-icon="mdi-check"
          @click="emit('confirm')"
        />
      </v-row>
    </v-container>
    <template #dialogActions>
      <CoreButton
        text-color="red-darken-1"
        label="cancelar"
        variant="text"
        @click="emit('close')"
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
  quadro: {
    type: Object,
    default: () => ({}),
  },
  unidade: {
    type: Object,
    default: () => ({}),
  },
});

const showDialog = computed({
  get() {
    return props.dialog;
  },
  set() {
    emit("close");
  },
});
</script>
