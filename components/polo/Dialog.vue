<template>
  <CoreDialog v-model="showDialog" persistent :title="dialogTitle" toolbar>
    <v-form ref="form">
      <v-row class="mt-1">
        <CoreInput
          v-model="dadosPolo.nome"
          clearable
          label="Nome*"
          required
          @input="dadosPolo.nome = $event"
        />
        <CoreInput
          v-model="dadosPolo.ordem"
          clearable
          label="Ordem*"
          required
          type="number"
          @input="dadosPolo.ordem = $event"
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
  polo: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["created", "updated", "close"]);

const message = ref("");
const showMessage = ref(false);
const form = ref(null);
const dadosPolo = ref({});
watch(
  () => props.polo,
  (newValue) => {
    dadosPolo.value = newValue;
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
  dadosPolo.value.id ? "Editar Polo" : "Adicionar Polo"
);

const onClickSalvar = async () => {
  const { valid } = await form.value.validate();
  if (!valid)
    return (
      (message.value = "Verifique os campos obrigatórios e tente novamente."),
      (showMessage.value = true)
    );

  dadosPolo.value.id ? editarPolo() : criarPolo();
};

const editarPolo = async () => {
  const { data: poloAtualizado } = await useFetch("/api/polos", {
    method: "PUT",
    body: dadosPolo.value,
  });

  if (poloAtualizado.value.error) {
    message.value = poloAtualizado.value.message;
    return (showMessage.value = true);
  }

  emit("updated", poloAtualizado);
};

const criarPolo = async () => {
  const { data: poloCriado } = await useFetch("/api/polos", {
    method: "POST",
    body: dadosPolo.value,
  });

  if (poloCriado.value.error) {
    message.value = poloCriado.value.message;
    return (showMessage.value = true);
  }

  emit("created", poloCriado);
};
</script>
