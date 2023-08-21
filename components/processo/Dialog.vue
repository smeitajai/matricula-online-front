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
import { format, parseISO } from "date-fns";

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
  faseInicialDataInicio: null,
  faseInicialDataFim: null,
  faseFinalDataInicio: null,
  faseFinalDataFim: null,
});

watch(
  () => props.processo,
  (newValue) => {
    dadosProcesso.value = newValue;
    if (newValue.id) formatData(dadosProcesso.value);
  }
);

const formatData = (processo) => {
  processo.faseInicialDataInicio = format(
    parseISO(processo.faseInicialDataInicio),
    "yyyy-MM-dd"
  );
  processo.faseInicialDataFim = format(
    parseISO(processo.faseInicialDataFim),
    "yyyy-MM-dd"
  );
  processo.faseFinalDataInicio = format(
    parseISO(processo.faseFinalDataInicio),
    "yyyy-MM-dd"
  );
  processo.faseFinalDataFim = format(
    parseISO(processo.faseFinalDataFim),
    "yyyy-MM-dd"
  );
};

const formatISO = (processo) => {
  processo.faseInicialDataInicio = new Date(
    processo.faseInicialDataInicio
  ).toISOString();
  processo.faseInicialDataFim = new Date(
    processo.faseInicialDataFim
  ).toISOString();
  processo.faseFinalDataInicio = new Date(
    processo.faseFinalDataInicio
  ).toISOString();
  processo.faseFinalDataFim = new Date(processo.faseFinalDataFim).toISOString();
};

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

const onClickSalvar = (valid) => {
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

  let processo = { ...dadosProcesso.value };
  formatISO(processo);

  dadosProcesso.value.id ? editarProcesso(processo) : criarProcesso(processo);
};

const editarProcesso = async (processo) => {
  const { data: processoAtualizado } = await useFetch("/api/processos", {
    method: "PUT",
    body: processo,
  });

  if (processoAtualizado.value.error) {
    message.value = processoAtualizado.value.message;
    return (showMessage.value = true);
  }

  emit("updated", processoAtualizado);
};

const criarProcesso = async (processo) => {
  const { data: processoCriado } = await useFetch("/api/processos", {
    method: "POST",
    body: processo,
  });

  if (processoCriado.value.error) {
    message.value = processoCriado.value.message;
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
