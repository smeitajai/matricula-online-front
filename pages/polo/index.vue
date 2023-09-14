<template>
  <v-row class="ma-5">
    <PageTitle title="Polos" />

    <v-col cols="12">
      <CoreList
        :item-text="(i) => i.nome"
        :item-text-sub="(i) => `Ordem: ${i.ordem}`"
        :items="polos"
        header="Polos Cadastrados"
        toolbar
        @click="onClickItem($event)"
      />
    </v-col>
  </v-row>

  <PoloDialog
    :dialog="dialog"
    :polo="dadosPolo"
    @close="dialog = false"
    @created="onCreate($event)"
    @updated="onUpdate($event)"
  />

  <CoreFloatingButton
    icon="mdi-plus"
    tooltip="Adicionar Polo"
    @click="(dadosPolo = {}), (dialog = true)"
  />

  <CoreSnackbar
    v-if="polos.error"
    v-model="polos.error"
    color="error"
    :message="polos.message"
  />
</template>

<script setup>
const dadosPolo = ref({});
const dialog = ref(false);

const { data: polos } = await useFetch("/api/polos");

const onClickItem = (polo) => {
  dadosPolo.value = { ...polo };
  dialog.value = true;
};

const onCreate = (polo) => {
  polos.value.push(polo.value);
  dialog.value = false;
};

const onUpdate = (polo) => {
  const indexPolo = polos.value.findIndex((p) => p.id == polo.value.id);
  Object.assign(polos.value[indexPolo], polo.value);
  dialog.value = false;
};
</script>
