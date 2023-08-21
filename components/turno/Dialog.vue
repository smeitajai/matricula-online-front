<template>
  <CoreDialog v-model="showDialog" persistent :title="dialogTitle" toolbar>
    <v-form ref="form">
      <v-row class="mt-1">
        <CoreInput
          v-model="dadosTurno.nome"
          clearable
          label="Nome do turno*"
          required
          @input="dadosTurno.nome = $event"
        />
        <CoreInput
          v-model="dadosTurno.idExterno"
          clearable
          label="ID Externo*"
          type="number"
          required
          @input="dadosTurno.idExterno = $event"
        />
      </v-row>
    </v-form>
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
const form = ref(null);
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

const onClickSalvar = async () => {
  const { valid } = await form.value.validate();
  if (!valid)
    return (
      (message.value = "Verifique os campos obrigatórios e tente novamente."),
      (showMessage.value = true)
    );

  dadosTurno.value.id ? editarTurno() : criarTurno();
};

const editarTurno = async () => {
  const { data: turnoAtualizado } = await useFetch("/api/turnos", {
    method: "PUT",
    body: dadosTurno.value,
  });

  if (turnoAtualizado.value.error) {
    message.value = turnoAtualizado.value.message;
    return (showMessage.value = true);
  }

  emit("updated", turnoAtualizado);
};

const criarTurno = async () => {
  const { data: turnoCriado } = await useFetch("/api/turnos", {
    method: "POST",
    body: dadosTurno.value,
  });

  if (turnoCriado.value.error) {
    message.value = turnoCriado.value.message;
    return (showMessage.value = true);
  }

  emit("created", turnoCriado);
};
</script>
