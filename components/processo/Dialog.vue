<template>
  <CoreDialog v-model="showDialog" persistent :title="dialogTitle" toolbar>
    <ProcessoForm
      v-model="dadosProcesso"
      :validate="validate"
      @valid="onClickSalvar($event)"
    />
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
        @click="validate = !validate"
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
  processo: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["created", "updated", "close"]);

const message = ref("");
const showMessage = ref(false);
const validate = ref(false);

const dadosProcesso = ref({
  edital: null,
  nome: null,
});

watch(
  () => props.processo,
  (newValue) => {
    dadosProcesso.value = newValue;
  },
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
  dadosProcesso.value.id ? "Editar Processo" : "Adicionar Processo",
);

const onClickSalvar = (valid) => {
  if (!valid)
    return (
      (message.value = "Verifique os campos obrigatórios e tente novamente."),
      (showMessage.value = true)
    );

  dadosProcesso.value.id ? editarProcesso() : criarProcesso();
};

const editarProcesso = async () => {
  const processoAtualizar = {
    ...dadosProcesso.value,
  };
  delete processoAtualizar.processoEtapas;
  const { data: processoAtualizado } = await useFetch("/api/processos", {
    method: "PUT",
    body: processoAtualizar,
  });

  if (processoAtualizado.value.error) {
    message.value = processoAtualizado.value.message;
    return (showMessage.value = true);
  }

  emit("updated", processoAtualizado);
};

const criarProcesso = async () => {
  const { data: processoCriado } = await useFetch("/api/processos", {
    method: "POST",
    body: dadosProcesso.value,
  });

  if (processoCriado.value.error) {
    message.value = processoCriado.value.message;
    return (showMessage.value = true);
  }

  emit("created", processoCriado);
};
</script>
