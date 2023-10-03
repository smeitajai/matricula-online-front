<template>
  <CoreDialog v-model="showDialog" persistent title="Encerrar Processo" toolbar>
    <v-row class="mt-1">
      <v-col cols="12">
        <span>Deseja encerrar o processo {{ processo.nome }}?</span>
      </v-col>
    </v-row>
    <template #dialogActions>
      <CoreButton
        text-color="red-darken-1"
        label="não"
        variant="text"
        @click="emit('close')"
      />
      <CoreButton
        text-color="green-darken-1"
        label="sim"
        variant="text"
        @click="onClickSim()"
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

const showDialog = computed({
  get() {
    return props.dialog;
  },
  set() {
    emit("close");
  },
});

const emit = defineEmits(["update", "close"]);

const message = ref("");
const showMessage = ref(false);

const onClickSim = async () => {
  const { data: processoAtualizado, error: errorProcesso } = await useFetch(
    "/api/processos",
    {
      method: "PUT",
      body: {
        id: props.processo.id,
        nome: props.processo.nome,
        edital: props.processo.edital,
        encerrado: true,
      },
    },
  );

  if (
    errorProcesso.value ||
    (processoAtualizado.value &&
      (processoAtualizado.value.error || processoAtualizado.value.statusCode))
  ) {
    errorProcesso.value
      ? (message.value = errorProcesso.value.message)
      : (message.value = processoAtualizado.value.message);
    return (showMessage.value = true);
  }

  emit("update", processoAtualizado.value);
};
</script>
