<template>
  <CoreDialog v-model="showDialog" persistent :title="dialogTitle" toolbar>
    <v-row class="mt-1">
      <CoreInput
        v-model="dadosEtapa.nome"
        clearable
        full-width
        label="Nome da etapa*"
        @input="dadosEtapa.nome = $event"
      />
      <CoreInput
        v-model="dadosEtapa.ordem"
        clearable
        label="Ordem*"
        type="number"
        @input="dadosEtapa.ordem = $event"
      />
      <CoreInput
        v-model="dadosEtapa.idExterno"
        clearable
        label="ID Externo*"
        type="number"
        @input="dadosEtapa.idExterno = $event"
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
  etapa: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["created", "updated", "close"]);

const message = ref("");
const showMessage = ref(false);
const dadosEtapa = ref({});
watch(
  () => props.etapa,
  (newValue) => {
    dadosEtapa.value = newValue;
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
  dadosEtapa.value.id ? "Editar Etapa" : "Adicionar Etapa"
);

const onClickSalvar = () => {
  if (!dadosEtapa.value.nome || !dadosEtapa.value.ordem) {
    message.value = "Verifique os campos obrigatórios e tente novamente!";
    return (showMessage.value = true);
  }

  dadosEtapa.value.id ? editarEtapa() : criarEtapa();
};

const editarEtapa = async () => {
  const { data: etapaAtualizada, error } = await usePUT(
    `etapas/${dadosEtapa.value.id}`,
    {
      nome: dadosEtapa.value.nome,
      ordem: parseInt(dadosEtapa.value.ordem),
      idExterno: dadosEtapa.value.idExterno,
    }
  );

  if (error.value) {
    message.value = error.value;
    return (showMessage.value = true);
  }

  emit("updated", etapaAtualizada);
};

const criarEtapa = async () => {
  const { data: etapaCriada, error } = await usePOST("etapas", {
    nome: dadosEtapa.value.nome,
    ordem: parseInt(dadosEtapa.value.ordem),
    idExterno: dadosEtapa.value.idExterno,
  });

  if (error.value) {
    message.value = error.value;
    return (showMessage.value = true);
  }

  emit("created", etapaCriada);
};
</script>
