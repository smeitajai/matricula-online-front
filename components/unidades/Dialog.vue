<template>
  <CoreDialog v-model="showDialog" persistent :title="dialogTitle" toolbar>
    <v-form ref="form">
      <v-row class="mt-1">
        <CoreInput
          v-model="dadosUnidade.nome"
          clearable
          full-width
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
        <CoreSelect
          v-model="dadosUnidade.polo"
          :items="polos"
          item-title="nome"
          label="Polo*"
          required
          @input="dadosUnidade.polo = $event"
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

const { data: polos } = await useFetch("/api/polos");

const message = ref("");
const showMessage = ref(false);
const form = ref(null);
const validateAddress = ref(true);
const dadosEndereco = ref({
  cep: null,
  bairro: null,
  logradouro: null,
  numero: null,
  complemento: null,
});
const dadosUnidade = ref({});
watch(
  () => props.unidade,
  (newValue) => {
    dadosUnidade.value = { ...newValue };
    dadosUnidade.value.id ? carregarEndereco() : (dadosEndereco.value = {});
    dadosUnidade.value.polo = dadosUnidade.value.poloId
      ? polos.value.find((p) => p.id == dadosUnidade.value.poloId)
      : null;
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

const carregarEndereco = async () => {
  const { data: endereco } = await useFetch(
    `/api/enderecos/${props.unidade.enderecoId}`,
  );
  if (endereco.value.error) {
    message.value = endereco.value.message;
    return (showMessage.value = true);
  }
  dadosEndereco.value = { ...endereco.value };
};

const onClickSalvar = async () => {
  const { valid } = await form.value.validate();

  if (!valid || !validateAddress.value)
    return (
      (message.value = "Verifique os campos obrigatórios e tente novamente."),
      (showMessage.value = true)
    );

  const mapEndereco = {
    ...dadosEndereco.value,
    cep: dadosEndereco.value.cep.toString(),
    numero: dadosEndereco.value.numero.toString(),
  };

  const mapUnidade = {
    ...dadosUnidade.value,
    poloId: dadosUnidade.value.polo.id,
  };
  delete mapUnidade.polo;

  dadosUnidade.value.id
    ? editarUnidade(mapEndereco, mapUnidade)
    : criarUnidade(mapEndereco, mapUnidade);
};

const editarUnidade = async (mapEndereco, mapUnidade) => {
  const { data: enderecoAtualizado } = await useFetch("/api/enderecos", {
    method: "PUT",
    body: mapEndereco,
  });

  if (enderecoAtualizado.value.error) {
    message.value = enderecoAtualizado.value.message;
    return (showMessage.value = true);
  }

  const { data: unidadeAtualizada } = await useFetch("/api/unidades", {
    method: "PUT",
    body: mapUnidade,
  });

  if (unidadeAtualizada.value.error) {
    message.value = unidadeAtualizada.value.message;
    return (showMessage.value = true);
  }

  emit("updated", unidadeAtualizada);
};

const criarUnidade = async (mapEndereco, mapUnidade) => {
  const { data: enderecoCriado } = await useFetch("/api/enderecos", {
    method: "POST",
    body: mapEndereco,
  });

  if (enderecoCriado.value.error) {
    message.value = enderecoCriado.value.message;
    return (showMessage.value = true);
  }

  const { data: unidadeCriada } = await useFetch("/api/unidades", {
    method: "POST",
    body: {
      ...mapUnidade,
      enderecoId: enderecoCriado.value.id,
    },
  });

  if (unidadeCriada.value.error) {
    message.value = unidadeCriada.value.message;
    return (showMessage.value = true);
  }

  emit("created", unidadeCriada);
};
</script>
