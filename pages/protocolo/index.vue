<template>
  <ProtocoloInfo />
  <v-row justify="end" class="ma-5">
    <CoreButton
      id="print-btn"
      label="Imprimir"
      prepend-icon="mdi-printer"
      @click="onImprimir()"
    />
  </v-row>
</template>

<script setup>
const onImprimir = () => {
  const appbar = document.querySelector("#app-bar");
  const printBtn = document.querySelector("#print-btn");
  const footer = document.querySelector("#footer");

  window.addEventListener("beforeprint", () => {
    appbar.style.display = "none";
    printBtn.style.display = "none";
    footer.style.display = "none";
  });

  window.addEventListener("afterprint", () => {
    appbar.style.display = "inline";
    printBtn.style.display = "inline-grid";
    footer.style.display = "inline";
  });

  window.print();
};
</script>
