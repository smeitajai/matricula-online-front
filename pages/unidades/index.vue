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

  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="720">
      <v-card>
        <v-card-title>
          <span class="text-h5">Adicionar Unidade</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="dadosUnidade.nome"
                  label="Nome da unidade*"
                  type="text"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Campo obrigatório']"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="dadosUnidade.idExterno"
                  label="ID do Erudio*"
                  type="number"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Campo obrigatório']"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-1" variant="text" @click="dialog = false">
            Cancelar
          </v-btn>
          <v-btn
            color="green-darken-1"
            variant="text"
            :loading="loading"
            @click="onClickSalvar()"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

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

  <v-snackbar
    v-model="snackbarError"
    class="mr-5"
    timeout="4000"
    rounded="xl"
    color="red"
    location="right top"
  >
    {{ snackbarError }}
  </v-snackbar>
</template>

<script setup>
const dadosUnidade = ref({});
const dialog = ref(false);
const loading = ref(false);

const { data: unidades, error: snackbarError } = useGET("unidades-ensino");

const onClickItem = (item) => {
  dadosUnidade.value = { ...item };
  dialog.value = true;
};

const onClickSalvar = () => {
  if (!dadosUnidade.value.nome || !dadosUnidade.value.idExterno) {
    return (snackbarError.value =
      "Verifique os campos obrigatórios e tente novamente!");
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
    return (snackbarError.value = error.value);
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
    return (snackbarError.value = error.value);
  }

  unidades.value.push(unidadeCriada.value);
  dialog.value = false;
};
</script>
