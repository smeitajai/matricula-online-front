<template>
  <v-col cols="auto">
    <CoreHeaderButton
      :icon="
        theme.global.name.value === 'customLightTheme'
          ? 'mdi-white-balance-sunny'
          : 'mdi-weather-night'
      "
      text="Trocar Tema"
      @click="toggleTheme()"
    />
  </v-col>
</template>

<script setup>
import { useTheme } from "vuetify";
const theme = useTheme();

onMounted(() => {
  theme.global.name.value = localStorage.getItem("theme") || "customLightTheme";
});

const toggleTheme = () => {
  theme.global.name.value =
    theme.global.name.value === "customLightTheme"
      ? "customDarkTheme"
      : "customLightTheme";

  localStorage.setItem("theme", theme.global.name.value);
};
</script>
