<template>
  <CoreDialog v-model="showDialog" persistent :title="dialogTitle" toolbar>
    <v-row class="mt-1">
      <CoreInput
        v-model="dadosTurno.nome"
        clearable
        full-width
        label="Nome do turno*"
        @input="dadosTurno.nome = $event"
      />
    </v-row>
    <template #dialogActions>
      <CoreButton
        text-color="red-darken-1"
        label="cancelar"
        variant="text"
        @click="emit('close')"
      />
      <CoreButton
        text-color="green-darken-1"
        label="salvar"
        variant="text"
        @click="onClickSalvar"
      />
    </template>
  </CoreDialog>

  <CoreSnackbar
    v-model="showMessage"
    color="red"
    :message="message"
    @hide="showMessage = $event"
  />
</template>

<script setup>
const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  turno: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["created", "updated", "close"]);

const message = ref("");
const showMessage = ref(false);
const dadosTurno = ref({});
watch(
  () => props.turno,
  (newValue) => {
    dadosTurno.value = newValue;
  }
);

const showDialog = computed({
  get() {
    return props.dialog;
  },
  set() {
    emit("close");
  },
});

const dialogTitle = computed(() =>
  dadosTurno.value.id ? "Editar Turno" : "Adicionar Turno"
);

const onClickSalvar = () => {
  if (!dadosTurno.value.nome) {
    message.value = "Verifique os campos obrigatórios e tente novamente!";
    return (showMessage.value = true);
  }

  dadosTurno.value.id ? editarTurno() : criarTurno();
};

const editarTurno = async () => {
  const { data: turnoAtualizado, error } = await usePUT(
    `turno/${dadosTurno.value.id}`,
    {
      nome: dadosTurno.value.nome,
    }
  );

  if (error.value) {
    message.value = error.value;
    return (showMessage.value = true);
  }

  emit("updated", turnoAtualizado);
};

const criarTurno = async () => {
  const { data: turnoCriado, error } = await usePOST("turno", {
    nome: dadosTurno.value.nome,
  });

  if (error.value) {
    message.value = error.value;
    return (showMessage.value = true);
  }

  emit("created", turnoCriado);
};
</script>
