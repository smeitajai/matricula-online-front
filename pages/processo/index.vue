<template>
  <v-row class="ma-5">
    <PageTitle title="Processo de Inscrição" />

    <v-col cols="12">
      <CoreList
        :item-text="(i) => `${i.nome} (Edital: ${i.edital})`"
        :item-text-sub="(i) => (i.encerrado ? '🔴 Encerrado' : '🟢 Ativo')"
        :items="processos"
        header="Processos Cadastrados"
        toolbar
        @click="onClickItem($event)"
      >
        <template #actions="{ item }">
          <v-row>
            <v-col class="pa-1">
              <CoreButton
                v-if="!item.encerrado"
                icon="mdi-close-thick"
                tooltip="Encerrar"
                :size="mobile ? 'small' : 'default'"
                @click.stop="onClickEncerrar(item)"
              />
            </v-col>
            <v-col class="pa-1">
              <CoreButton
                icon="mdi-pencil"
                tooltip="Editar"
                :size="mobile ? 'small' : 'default'"
                @click.stop="onClickEditar(item)"
              />
            </v-col>
          </v-row>
        </template>
      </CoreList>
    </v-col>
  </v-row>

  <ProcessoDialog
    :dialog="dialog"
    :processo="dadosProcesso"
    @close="dialog = false"
    @created="onCreate($event)"
    @updated="onUpdate($event)"
  />

  <ProcessoEncerrarDialog
    v-if="dialogEncerrar"
    :dialog="dialogEncerrar"
    :processo="processoEncerrar"
    @update="onUpdateProcesso($event)"
    @close="dialogEncerrar = false"
  />

  <CoreFloatingButton
    icon="mdi-plus"
    tooltip="Adicionar Processo"
    @click="(dadosProcesso = {}), (dialog = true)"
  />

  <CoreSnackbar
    v-model="showMessage"
    color="error"
    :message="message"
    @hide="showMessage = $event"
  />
</template>

<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();
const dadosProcesso = ref({});
const processoEncerrar = ref({});
const dialog = ref(false);
const dialogEncerrar = ref(false);
const showMessage = ref(false);
const message = ref("");

const { data: processos, error } = await useFetch("/api/processos");

onMounted(() => {
  if (error.value || (processos.value && processos.value.error)) {
    error.value
      ? (message.value = error.value.message)
      : (message.value = processos.value.message);
    return (showMessage.value = true);
  }
});

const onClickItem = async (processo) => {
  await navigateTo({
    path: "/processo/etapas",
    query: {
      processo: processo.id,
    },
  });
};

const onClickEditar = (processo) => {
  dadosProcesso.value = { ...processo };
  dialog.value = true;
};

const onClickEncerrar = (processo) => {
  processoEncerrar.value = processo;
  dialogEncerrar.value = true;
};

const onUpdateProcesso = (processo) => {
  const indexProcesso = processos.value.findIndex((p) => p.id == processo.id);
  Object.assign(processos.value[indexProcesso], processo);
  dialogEncerrar.value = false;
};

const onCreate = (processo) => {
  processos.value.push(processo.value);
  dialog.value = false;
};

const onUpdate = (processo) => {
  const indexProcesso = processos.value.findIndex(
    (p) => p.id == processo.value.id,
  );
  Object.assign(processos.value[indexProcesso], processo.value);
  dialog.value = false;
};
</script>
