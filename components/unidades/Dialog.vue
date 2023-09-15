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
          required
          @input="dadosUnidade.idExterno = $event"
        />
      </v-row>
      <CoreFormSubtitle label="Endereço" />
      <CoreAddress
        ref="formEndereco"
        v-model="dadosEndereco"
        @validate="validateAddress = $event"
      />
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
const validateAddress = ref(false);
const dadosEndereco = ref({
  cep: null,
  bairro: null,
  logradouro: null,
  numero: null,
  complemento: null,
  polo: null,
});
const dadosUnidade = ref({});
watch(
  () => props.unidade,
  (newValue) => {
    dadosUnidade.value = newValue;
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
  dadosUnidade.value.id ? "Editar Unidade" : "Adicionar Unidade",
);

const onClickSalvar = async () => {
  const { valid } = await form.value.validate();
  if (!valid || !validateAddress.value)
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

  const { data: enderecoAtualizado } = await useFetch("/api/enderecos", {
    method: "PUT",
    body: {
      id: dadosEndereco.value.id,
      cep: dadosEndereco.value.cep.toString(),
      bairro: dadosEndereco.value.bairro,
      logradouro: dadosEndereco.value.logradouro,
      numero: dadosEndereco.value.numero.toString(),
      complemento: dadosEndereco.value.complemento,
      poloId: dadosEndereco.value.polo.id,
      //unidadeId: unidadeCriada.value.id,
    },
  });

  if (enderecoAtualizado.value.error) {
    message.value = enderecoAtualizado.value.message;
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

  const { data: enderecoCriado } = await useFetch("/api/enderecos", {
    method: "POST",
    body: {
      cep: dadosEndereco.value.cep.toString(),
      bairro: dadosEndereco.value.bairro,
      logradouro: dadosEndereco.value.logradouro,
      numero: dadosEndereco.value.numero.toString(),
      complemento: dadosEndereco.value.complemento,
      poloId: dadosEndereco.value.polo.id,
      //unidadeId: unidadeCriada.value.id,
    },
  });

  if (enderecoCriado.value.error) {
    message.value = enderecoCriado.value.message;
    return (showMessage.value = true);
  }

  emit("created", unidadeCriada);
};
</script>
