<template>
  <CoreDialog v-model="showDialog" persistent :title="dialogTitle" toolbar>
    <v-form ref="form">
      <v-row class="mt-1">
        <v-col :cols="mobile ? 12 : 4" class="py-0">
          <CoreSelect
            v-model="dadosQuadro.etapa"
            :items="etapas"
            full-width
            item-title="nome"
            label="Etapa*"
            required
            @input="dadosQuadro.etapa = $event"
          />
        </v-col>
        <v-col :cols="mobile ? 12 : 4" class="py-0">
          <CoreSelect
            v-model="dadosQuadro.turno"
            :items="turnos"
            full-width
            item-title="nome"
            label="Turno*"
            required
            @input="dadosQuadro.turno = $event"
          />
        </v-col>
        <v-col :cols="mobile ? 12 : 4" class="py-0">
          <CoreInput
            v-model="dadosQuadro.quantidadeVaga"
            clearable
            full-width
            label="Vagas*"
            required
            type="number"
            @input="dadosQuadro.quantidadeVaga = $event"
          />
        </v-col>
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
  etapas: {
    type: Array,
    default: () => [],
  },
  quadro: {
    type: Object,
    default: () => ({}),
  },
  turnos: {
    type: Array,
    default: () => [],
  },
  unidade: {
    type: Object,
    default: () => ({}),
  },
});

const mobile = useMobile();
const emit = defineEmits(["created", "updated", "close"]);

const message = ref("");
const showMessage = ref(false);
const form = ref(null);
const dadosQuadro = ref({});

onMounted(() => {
  dadosQuadro.value = {
    ...props.quadro,
    unidadeEnsino: { ...props.unidade },
  };
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
  dadosQuadro.value.id ? "Editar Quadro" : "Adicionar Quadro"
);

const onClickSalvar = async () => {
  const { valid } = await form.value.validate();
  if (!valid)
    return (
      (message.value = "Verifique os campos obrigatórios e tente novamente."),
      (showMessage.value = true)
    );

  console.log("dadosQuadro.value :>> ", dadosQuadro.value);
  dadosQuadro.value.id ? editarQuadro() : criarQuadro();
};

const criarQuadro = async () => {
  const { data: quadroCadastrado, error } = await usePOST("quadros-vaga", {
    ...dadosQuadro.value,
    quantidadeVaga: parseInt(dadosQuadro.value.quantidadeVaga),
  });

  if (error.value) {
    message.value = error.value;
    return (showMessage.value = true);
  }

  emit("created", quadroCadastrado);
};

const editarQuadro = async () => {
  const { data: quadroAtualizado, error } = await usePUT(
    `quadros-vaga/${dadosQuadro.value.id}`,
    {
      ...dadosQuadro.value,
      quantidadeVaga: parseInt(dadosQuadro.value.quantidadeVaga),
    }
  );

  if (error.value) {
    message.value = error.value;
    return (showMessage.value = true);
  }

  emit("updated", quadroAtualizado);
};
</script>
