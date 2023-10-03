<template>
  <CoreDialog v-model="showDialog" persistent :title="dialogTitle" toolbar>
    <ProcessoEtapaForm
      v-model="dadosEtapa"
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
  etapa: {
    type: Object,
    default: () => ({}),
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

watch(
  () => props.etapa,
  (newValue) => {
    dadosEtapa.value = { ...newValue };
  },
);

const dadosEtapa = ref({
  nome: null,
  faseInicialDataInicio: null,
  faseInicialDataFim: null,
  faseFinalDataInicio: null,
  faseFinalDataFim: null,
});

const showDialog = computed({
  get() {
    return props.dialog;
  },
  set() {
    emit("close");
  },
});

const dialogTitle = computed(() =>
  dadosEtapa.value.id ? "Editar Etapa" : "Adicionar Etapa",
);

const DataFormatISO = (etapa) => {
  etapa.faseInicialDataInicio = new Date(
    etapa.faseInicialDataInicio,
  ).toISOString();
  etapa.faseInicialDataFim = new Date(etapa.faseInicialDataFim).toISOString();
  etapa.faseFinalDataInicio = new Date(etapa.faseFinalDataInicio).toISOString();
  etapa.faseFinalDataFim = new Date(etapa.faseFinalDataFim).toISOString();
};

const onClickSalvar = (valid) => {
  if (!valid)
    return (
      (message.value = "Verifique os campos obrigatórios e tente novamente."),
      (showMessage.value = true)
    );
  if (!validateDatesProcesso(dadosEtapa.value))
    return (
      (message.value =
        "Datas Inválidas! Verifique o período das datas e tente novamente."),
      (showMessage.value = true)
    );

  let etapaProcesso = { ...dadosEtapa.value };
  delete etapaProcesso.emAndamento;
  etapaProcesso.processoId = props.processo.id;
  DataFormatISO(etapaProcesso);

  dadosEtapa.value.id
    ? editarEtapaProcesso(etapaProcesso)
    : criarEtapaProcesso(etapaProcesso);
};

const editarEtapaProcesso = async (etapaProcesso) => {
  const { data: etapaAtualizada } = await useFetch("/api/processo-etapas", {
    method: "PUT",
    body: etapaProcesso,
  });

  if (etapaAtualizada.value.error) {
    message.value = etapaAtualizada.value.message;
    return (showMessage.value = true);
  }

  emit("updated", etapaAtualizada);
};

const criarEtapaProcesso = async (etapaProcesso) => {
  const { data: etapaCriada } = await useFetch("/api/processo-etapas", {
    method: "POST",
    body: etapaProcesso,
  });

  if (etapaCriada.value.error) {
    message.value = etapaCriada.value.message;
    return (showMessage.value = true);
  }

  emit("created", etapaCriada);
};
</script>
