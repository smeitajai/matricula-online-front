<template>
  <v-col cols="auto">
    <v-btn
      :icon="
        theme.global.name.value === 'customLightTheme'
          ? 'mdi-white-balance-sunny'
          : 'mdi-weather-night'
      "
      @click="toggleTheme()"
    ></v-btn>
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
