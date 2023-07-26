<template>
  <v-col cols="12">
    <v-row align="center">
      <template v-if="label">
        <v-col cols="1">
          <v-divider class="grey lighten-1" />
        </v-col>
        <v-col cols="auto" class="text-overline text-grey">{{ label }}</v-col>
      </template>
      <v-col>
        <v-divider class="grey lighten-1" />
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: null,
  },
});
</script>
