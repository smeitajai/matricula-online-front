<template>
  <v-row class="ma-5">
    <v-col cols="12">
      <span class="text-h4">Unidades de Ensino</span>
    </v-col>

    <v-col cols="12">
      <v-card elevation="2">
        <v-toolbar color="primary" density="compact">
          <v-toolbar-title> Unidades Cadastradas </v-toolbar-title>
        </v-toolbar>
        <v-list v-if="unidades && unidades.length">
          <v-list-item
            v-for="(item, i) in unidades"
            :key="i"
            :value="item"
            @click="onClickItem(item)"
          >
            <v-list-item-title
              >{{ item.nome }} [{{ item.idExterno }}]</v-list-item-title
            >
          </v-list-item>
        </v-list>
        <span v-else class="pa-2">Nenhuma unidade encontrada</span>
      </v-card>
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

  <v-tooltip text="Adicionar Unidade">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        class="mr-5"
        color="primary"
        icon
        location="right"
        position="fixed"
        size="x-large"
        @click="(dadosUnidade = {}), (dialog = true)"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
  </v-tooltip>

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
const dialogTitle = computed(() =>
  dadosUnidade.value.id ? "Editar Unidade" : "Adicionar Unidade"
);
const message = ref("");
const showMessage = ref(false);

const { data: unidades, error: snackbarError } = useGET("unidades-ensino");

const onClickItem = (item) => {
  dadosUnidade.value = { ...item };
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
