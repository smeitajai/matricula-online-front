<template>
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
  <CoreSnackbar
    v-model="showMessage"
    color="error"
    :message="message"
    @hide="showMessage = $event"
  />
</template>

<script setup>
const route = useRoute();
const { data: inscricao } = await useFetch(
  `/api/protocolos/${route.query.inscricao}`,
);

const showMessage = ref(false);
const message = ref("");

const onClickImprimir = () => {
  const appbar = document.querySelector("#app-bar");
  const modelo = document.querySelector("#modelo");
  const protocol = document.querySelector("#protocol");
  const footer = document.querySelector("#footer");

  window.addEventListener("beforeprint", () => {
    appbar.style.display = "none";
    modelo.style.display = "none";
    protocol.style.display = "none";
    footer.style.display = "none";
  });

  window.addEventListener("afterprint", () => {
    appbar.style.display = "inline";
    modelo.style.display = "inline";
    protocol.style.display = "flex";
    footer.style.display = "inline";
  });

  window.print();
};

const onClickInicio = async () => {
  await navigateTo({
    path: "/",
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
