<template>
  <CoreDialog
    v-model="showDialog"
    persistent
    :title="`Vagas | ${dadosEtapa.nome}`"
    toolbar
  >
    <v-row class="mt-1">
      <CoreInput
        v-for="item in turnos"
        :key="item.id"
        v-model="dadosEtapa[item.nome]"
        clearable
        :label="item.nome.toUpperCase()"
        @input="dadosEtapa[item.nome] = $event"
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

// conts { data: turnos } = await useGET("turnos");
const turnos = ref([
  { id: "2", nome: "matutino" },
  { id: "3", nome: "vespertino" },
  { id: "4", nome: "noturno" },
]);

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

const onClickSalvar = () => {
  // if (!dadosEtapa.value.nome || !dadosEtapa.value.ordem) {
  //   message.value = "Verifique os campos obrigatórios e tente novamente!";
  //   return (showMessage.value = true);
  // }

  console.log("dadosEtapa.value :>> ", dadosEtapa.value);

  //editarVagas(); Atualizar a Quantidade de Vagas, Vai ser request Única? OU vai alterar um turno por vez?
};

const editarVagas = async () => {
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
</script>
