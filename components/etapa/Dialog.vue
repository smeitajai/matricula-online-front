<template>
  <CoreDialog v-model="showDialog" persistent :title="dialogTitle" toolbar>
    <v-form ref="form">
      <v-row class="mt-1">
        <CoreInput
          v-model="dadosEtapa.nome"
          clearable
          full-width
          label="Nome da etapa*"
          required
          @input="dadosEtapa.nome = $event"
        />
        <CoreInput
          v-model="dadosEtapa.ordem"
          clearable
          label="Ordem*"
          type="number"
          required
          @input="dadosEtapa.ordem = $event"
        />
        <CoreInput
          v-model="dadosEtapa.idExterno"
          clearable
          label="ID Externo*"
          required
          @input="dadosEtapa.idExterno = $event"
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
  etapa: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["created", "updated", "close"]);

const message = ref("");
const showMessage = ref(false);
const form = ref(null);
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

const onClickSalvar = async () => {
  const { valid } = await form.value.validate();
  if (!valid)
    return (
      (message.value = "Verifique os campos obrigatórios e tente novamente."),
      (showMessage.value = true)
    );

  dadosEtapa.value.id ? editarEtapa() : criarEtapa();
};

const editarEtapa = async () => {
  const { data: etapaAtualizada } = await useFetch("/api/etapas", {
    method: "PUT",
    body: dadosEtapa.value,
  });

  if (etapaAtualizada.value.error) {
    message.value = etapaAtualizada.value.message;
    return (showMessage.value = true);
  }

  emit("updated", etapaAtualizada);
};

const criarEtapa = async () => {
  const { data: etapaCriada } = await useFetch("/api/etapas", {
    method: "POST",
    body: dadosEtapa.value,
  });

  if (etapaCriada.value.error) {
    message.value = etapaCriada.value.message;
    return (showMessage.value = true);
  }

  emit("created", etapaCriada);
};
</script>
