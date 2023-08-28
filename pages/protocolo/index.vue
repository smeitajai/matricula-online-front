<template>
  <ProtocoloInfo />
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
</template>

<script setup>
const onClickImprimir = () => {
  const appbar = document.querySelector("#app-bar");
  const protocol = document.querySelector("#protocol");
  const footer = document.querySelector("#footer");

  window.addEventListener("beforeprint", () => {
    appbar.style.display = "none";
    protocol.style.display = "none";
    footer.style.display = "none";
  });

  window.addEventListener("afterprint", () => {
    appbar.style.display = "inline";
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
