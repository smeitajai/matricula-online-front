<template>
  <div>
    <v-app dark>
      <v-main>
        <Header v-if="isNotHome" />
        <slot />
        <Footer />
      </v-main>
    </v-app>
  </div>
</template>

<script setup>
const route = useRoute();
const isNotHome = computed(() => (route.path != "/" ? true : false));
</script>
