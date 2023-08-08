<template>
  <v-app-bar color="grey-lighten-2" density="comfortable">
    <v-app-bar-nav-icon
      variant="text"
      @click.stop="drawer = !drawer"
    ></v-app-bar-nav-icon>
    <v-app-bar-title>Matrícula On-line</v-app-bar-title>
    <v-spacer />
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" location="left" temporary>
    <v-list>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        router
        exact
      >
        <v-list-item-title>
          <v-icon>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
const drawer = ref(false);

const items = ref([
  {
    icon: "mdi-apps",
    title: "Início",
    to: "/",
  },
  {
    icon: "mdi-clipboard-text-outline",
    title: "Inscrição",
    to: "/cadastro",
  },
  {
    icon: "mdi-chart-timeline",
    title: "Processos",
    to: "/processo",
  },
  {
    icon: "mdi-bulletin-board",
    title: "Quadro de Vagas",
    to: "/quadro",
  },
  {
    icon: "mdi-home-variant-outline",
    title: "Unidades",
    to: "/unidades",
  },
  {
    icon: "mdi-format-list-numbered",
    title: "Etapa",
    to: "/etapa",
  },
  {
    icon: "mdi-clock-outline",
    title: "Turno",
    to: "/turno",
  },
  {
    icon: "mdi-progress-question",
    title: "Sobre",
    to: "/sobre",
  },
]);
</script>
