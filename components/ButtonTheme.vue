<template>
  <v-col cols="auto">
    <v-tooltip text="Trocar Tema" location="top">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          :icon="
            theme.global.name.value === 'customLightTheme'
              ? 'mdi-white-balance-sunny'
              : 'mdi-weather-night'
          "
          @click="toggleTheme()"
        ></v-btn>
      </template>
    </v-tooltip>
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
