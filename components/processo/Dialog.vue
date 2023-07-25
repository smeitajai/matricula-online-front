<template>
  <CoreDialog v-model="showDialog" persistent :title="dialogTitle" toolbar>
    <v-form ref="form">
      <v-row class="ma-0">
        <CoreInput
          v-model="dadosProcesso.nome"
          clearable
          label="Nome*"
          required
          @input="dadosProcesso.nome = $event"
        />
        <CoreInput
          v-model="dadosProcesso.edital"
          clearable
          label="Edital"
          @input="dadosProcesso.edital = $event"
        />

        <CoreFormSubtitle label="Fase Inicial" class="pt-0" />
        <CoreInput
          v-model="dadosProcesso.faseInicialDataInicio"
          label="Data Inicial*"
          type="date"
          required
          @input="dadosProcesso.faseInicialDataInicio = $event"
        />
        <CoreInput
          v-model="dadosProcesso.faseInicialDataFim"
          label="Data Final*"
          type="date"
          required
          @input="dadosProcesso.faseInicialDataFim = $event"
        />

        <CoreFormSubtitle label="Fase Final" class="pt-0" />
        <CoreInput
          v-model="dadosProcesso.faseFinalDataInicio"
          label="Data Inicial*"
          type="date"
          required
          @input="dadosProcesso.faseFinalDataInicio = $event"
        />
        <CoreInput
          v-model="dadosProcesso.faseFinalDataFim"
          label="Data Final*"
          type="date"
          required
          @input="dadosProcesso.faseFinalDataFim = $event"
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
        @click="onClickSalvar()"
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

const form = ref(null);
const message = ref("");
const showMessage = ref(false);
const dadosProcesso = ref({});
watch(
  () => props.processo,
  (newValue) => {
    dadosProcesso.value = newValue;
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
  dadosProcesso.value.id ? "Editar Processo" : "Adicionar Processo"
);

const onClickSalvar = async () => {
  const { valid } = await form.value.validate();
  if (!valid)
    return (
      (message.value = "Verifique os campos obrigatórios e tente novamente."),
      (showMessage.value = true)
    );
  if (datasInvalidas())
    return (
      (message.value =
        "Datas Inválidas! Verifique o período das datas e tente novamente."),
      (showMessage.value = true)
    );

  dadosProcesso.value.id ? editarProcesso() : criarProcesso();
};

const editarProcesso = async () => {
  const { data: processoAtualizado, error } = await usePUT(
    `processo/${dadosProcesso.value.id}`,
    { ...dadosProcesso.value }
  );

  if (error.value) {
    message.value = error.value;
    return (showMessage.value = true);
  }

  emit("updated", processoAtualizado);
};

const criarProcesso = async () => {
  const { data: processoCriado, error } = await usePOST("processo", {
    ...dadosProcesso.value,
  });

  if (error.value) {
    message.value = error.value;
    return (showMessage.value = true);
  }

  emit("created", processoCriado);
};

const datasInvalidas = () => {
  if (
    dadosProcesso.value.faseInicialDataInicio >
    dadosProcesso.value.faseInicialDataFim
  )
    return true;

  if (
    dadosProcesso.value.faseInicialDataFim >
    dadosProcesso.value.faseFinalDataInicio
  )
    return true;

  if (
    dadosProcesso.value.faseFinalDataInicio >
    dadosProcesso.value.faseFinalDataFim
  )
    return true;

  return false;
};
</script>
