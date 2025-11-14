<template>
  <v-app-bar id="app-bar" color="primary-darken-1" density="comfortable">
    <v-app-bar-nav-icon
      variant="text"
      @click.stop="drawer = !drawer"
    ></v-app-bar-nav-icon>
    <v-app-bar-title>Matrícula On-line</v-app-bar-title>
    <ButtonTheme />
    <!-- <ButtonLogin /> -->
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
const items = ref();

const menuDefault = [
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
    icon: "mdi-file-find-outline",
    title: "Consulta Protocolo",
    to: "/consulta",
  },
  {
    icon: "mdi-progress-question",
    title: "Ajuda",
    to: "/ajuda",
  },
];

const menuAuth = [
  ...menuDefault,
  {
    icon: "mdi-bulletin-board",
    title: "Quadro de Vagas",
    to: "/quadro",
  },
  {
    icon: "mdi-chart-timeline",
    title: "Processos",
    to: "/processo",
  },
  {
    icon: "mdi-map-marker-radius",
    title: "Polos",
    to: "/polo",
  },
  {
    icon: "mdi-home-variant-outline",
    title: "Unidades",
    to: "/unidades",
  },
  {
    icon: "mdi-format-list-numbered",
    title: "Etapas",
    to: "/etapa",
  },
  {
    icon: "mdi-clock-outline",
    title: "Turnos",
    to: "/turno",
  },
];

const user = useSupabaseUser();

watchEffect(() => {
  if (user.value) {
    items.value = menuAuth;
  } else {
    items.value = menuDefault;
  }
});
</script>
