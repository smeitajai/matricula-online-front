<template>
  <v-row class="ma-5">
    <PageTitle title="Unidades de Ensino" />

    <v-col cols="12">
      <CoreList
        :item-text-sub="(i) => `ID: ${i.idExterno}`"
        :item-text="(i) => i.nome"
        :items="unidades"
        header="Unidades Cadastradas"
        toolbar
        @click="onClickItem($event)"
      />
    </v-col>
  </v-row>

  <CoreDialog v-model="dialog" persistent :title="dialogTitle" toolbar>
    <v-row class="mt-1">
      <CoreInput
        v-model="dadosUnidade.nome"
        clearable
        label="Nome da unidade*"
        @input="dadosUnidade.nome = $event"
      />
      <CoreInput
        v-model="dadosUnidade.idExterno"
        clearable
        label="ID Externo*"
        type="number"
        @input="dadosUnidade.idExterno = $event"
      />
    </v-row>
    <template #dialogActions>
      <CoreButton
        text-color="red-darken-1"
        label="cancelar"
        variant="text"
        @click="dialog = false"
      />
      <CoreButton
        text-color="green-darken-1"
        label="salvar"
        variant="text"
        @click="onClickSalvar"
      />
    </template>
  </CoreDialog>

  <CoreFloatingButton
    icon="mdi-plus"
    tooltip="Adicionar Unidade"
    @click="(dadosUnidade = {}), (dialog = true)"
  />

  <CoreSnackbar
    v-model="showMessage"
    color="red"
    :message="message"
    @hide="showMessage = $event"
  />
</template>

<script setup>
const dadosUnidade = ref({});
const dialog = ref(false);
const message = ref("");
const showMessage = ref(false);
const dialogTitle = computed(() =>
  dadosUnidade.value.id ? "Editar Unidade" : "Adicionar Unidade"
);

const { data: unidades, error: snackbarError } = useGET("unidades-ensino");

const onClickItem = (unidade) => {
  dadosUnidade.value = { ...unidade };
  dialog.value = true;
};

const onClickSalvar = () => {
  if (!dadosUnidade.value.nome || !dadosUnidade.value.idExterno) {
    message.value = "Verifique os campos obrigatórios e tente novamente!";
    return (showMessage.value = true);
  }

  dadosUnidade.value.id ? editarUnidade() : criarUnidade();
};

const editarUnidade = async () => {
  const { data: unidadeAtualizada, error } = await usePUT(
    `unidades-ensino/${dadosUnidade.value.id}`,
    {
      nome: dadosUnidade.value.nome,
      idExterno: dadosUnidade.value.idExterno,
    }
  );

  if (error.value) {
    message.value = error.value;
    return (showMessage.value = true);
  }

  const indexUnidade = unidades.value.findIndex(
    (unidade) => unidade.id == unidadeAtualizada.value.id
  );
  Object.assign(unidades.value[indexUnidade], unidadeAtualizada.value);
  dialog.value = false;
};

const criarUnidade = async () => {
  const { data: unidadeCriada, error } = await usePOST("unidades-ensino", {
    nome: dadosUnidade.value.nome,
    idExterno: dadosUnidade.value.idExterno,
  });

  if (error.value) {
    message.value = error.value;
    return (showMessage.value = true);
  }

  unidades.value.push(unidadeCriada.value);
  dialog.value = false;
};
</script>
