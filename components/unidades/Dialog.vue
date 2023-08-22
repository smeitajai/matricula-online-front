<template>
  <CoreDialog v-model="showDialog" persistent :title="dialogTitle" toolbar>
    <v-form ref="form">
      <v-row class="mt-1">
        <CoreInput
          v-model="dadosUnidade.nome"
          clearable
          label="Nome da unidade*"
          required
          @input="dadosUnidade.nome = $event"
        />
        <CoreInput
          v-model="dadosUnidade.idExterno"
          clearable
          label="ID Externo*"
          type="number"
          required
          @input="dadosUnidade.idExterno = $event"
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
  unidade: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["created", "updated", "close"]);

const message = ref("");
const showMessage = ref(false);
const form = ref(null);
const dadosUnidade = ref({});
watch(
  () => props.unidade,
  (newValue) => {
    dadosUnidade.value = newValue;
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
  dadosUnidade.value.id ? "Editar Unidade" : "Adicionar Unidade"
);

const onClickSalvar = async () => {
  const { valid } = await form.value.validate();
  if (!valid)
    return (
      (message.value = "Verifique os campos obrigatórios e tente novamente."),
      (showMessage.value = true)
    );

  dadosUnidade.value.id ? editarUnidade() : criarUnidade();
};

const editarUnidade = async () => {
  const { data: unidadeAtualizada } = await useFetch("/api/unidades", {
    method: "PUT",
    body: dadosUnidade.value,
  });

  if (unidadeAtualizada.value.error) {
    message.value = unidadeAtualizada.value.message;
    return (showMessage.value = true);
  }

  emit("updated", unidadeAtualizada);
};

const criarUnidade = async () => {
  const { data: unidadeCriada } = await useFetch("/api/unidades", {
    method: "POST",
    body: dadosUnidade.value,
  });

  if (unidadeCriada.value.error) {
    message.value = unidadeCriada.value.message;
    return (showMessage.value = true);
  }

  emit("created", unidadeCriada);
};
</script>
