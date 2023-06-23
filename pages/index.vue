<template>
  <div>
    <h1>Bem-vindo ao sistema de matrícula on-line</h1>

    <v-row class="pa-3">
      <v-col cols="6">
        <v-text-field v-model="count" label="Count" variant="outlined" />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="double"
          label="Double"
          variant="outlined"
          readonly
        />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-btn prepend-icon="mdi-plus" color="primary" @click="increment"
        >Increment counter</v-btn
      >
    </v-row>
  </div>
</template>

<script setup>
const count = ref(0);
const double = computed(() => count.value * 2);
const increment = () => count.value++;
</script>
