<template>
  <v-row v-if="pending" class="pa-8">Carregando...</v-row>

  <v-row v-else-if="error || (inscricao && inscricao.statusCode)" class="pa-8">
    <v-col cols="12">Ocorreu um erro ao carregar o protocolo.</v-col>
    <v-col cols="12>">
      <CoreButton
        label="Consultar Protocolo"
        prepend-icon="mdi-file-find-outline"
        @click="onClickConsultarProtocolo()"
      />
    </v-col>
  </v-row>

  <div v-else>
    <ProtocoloInfo v-if="inscricao" :inscricao="inscricao" />
    <v-row id="protocol" justify="end" class="ma-5">
      <div class="mx-2">
        <CoreButton
          label="Início"
          prepend-icon="mdi-apps"
          @click="onClickInicio()"
        />
      </div>
      <div class="mx-2">
        <CoreButton
          label="Imprimir"
          prepend-icon="mdi-printer"
          @click="onClickImprimir()"
        />
      </div>
    </v-row>
  </div>
  <CoreSnackbar
    v-model="showMessage"
    color="error"
    :message="message"
    @hide="showMessage = $event"
  />
</template>

<script setup>
const route = useRoute();
const {
  data: inscricao,
  error,
  pending,
} = useFetch(() => `/api/protocolos/${route.query.inscricao}`);

const showMessage = ref(false);
const message = ref("");

const onClickImprimir = () => {
  const appbar = document.querySelector("#app-bar");
  const protocol = document.querySelector("#protocol");
  const footer = document.querySelector("#footer");

  window.addEventListener("beforeprint", () => {
    if (appbar) appbar.style.display = "none";
    if (protocol) protocol.style.display = "none";
    if (footer) footer.style.display = "none";
  });

  window.addEventListener("afterprint", () => {
    if (appbar) appbar.style.display = "inline";
    if (protocol) protocol.style.display = "flex";
    if (footer) footer.style.display = "inline";
  });

  window.print();
};

const onClickInicio = async () => {
  await navigateTo({
    path: "/",
  });
};

const onClickConsultarProtocolo = async () => {
  await navigateTo({
    path: "/consulta",
  });
};
</script>

<style scoped>
/* Remover o cabeçalho e o rodapé padrão para impressão */
@page {
  size: auto;
  margin: 0;
}
</style>
