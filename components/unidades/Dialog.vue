<template>
  <CoreDialog v-model="showDialog" persistent :title="dialogTitle" toolbar>
    <v-row class="mt-1">
      <CoreInput
        v-model="dadosUnidade.nome"
        clearable
        label="Nome da unidade*"
        @input="dadosUnidade.nome = $event"
      />
      <CoreInput
        v-model="dadosUnidade.idExterno"
        clearable
        label="ID Externo*"
        type="number"
        @input="dadosUnidade.idExterno = $event"
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
  unidade: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["created", "updated", "close"]);

const message = ref("");
const showMessage = ref(false);
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

const onClickSalvar = () => {
  if (!dadosUnidade.value.nome || !dadosUnidade.value.idExterno) {
    message.value = "Verifique os campos obrigatórios e tente novamente!";
    return (showMessage.value = true);
  }

  dadosUnidade.value.id ? editarUnidade() : criarUnidade();
};

const editarUnidade = async () => {
  const { data: unidadeAtualizada, error } = await usePUT(
    `unidades-ensino/${dadosUnidade.value.id}`,
    {
      nome: dadosUnidade.value.nome,
      idExterno: dadosUnidade.value.idExterno,
    }
  );

  if (error.value) {
    message.value = error.value;
    return (showMessage.value = true);
  }

  emit("updated", unidadeAtualizada);
};

const criarUnidade = async () => {
  const { data: unidadeCriada, error } = await usePOST("unidades-ensino", {
    nome: dadosUnidade.value.nome,
    idExterno: dadosUnidade.value.idExterno,
  });

  if (error.value) {
    message.value = error.value;
    return (showMessage.value = true);
  }

  emit("created", unidadeCriada);
};
</script>
