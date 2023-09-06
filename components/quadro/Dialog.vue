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
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

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

  dadosQuadro.value.id ? editarQuadro() : criarQuadro();
};

const criarQuadro = async () => {
  const { data: quadroCadastrado } = await useFetch("/api/quadros-vaga", {
    method: "POST",
    body: dadosQuadro.value,
  });

  if (quadroCadastrado.value.error) {
    message.value = quadroCadastrado.value.message;
    return (showMessage.value = true);
  }

  emit("created", quadroCadastrado);
};

const editarQuadro = async () => {
  const { data: quadroAtualizado } = await useFetch("/api/quadros-vaga", {
    method: "PUT",
    body: dadosQuadro.value,
  });

  if (quadroAtualizado.value.error) {
    message.value = quadroAtualizado.value.message;
    return (showMessage.value = true);
  }

  emit("updated", quadroAtualizado);
};
</script>
