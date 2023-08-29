<template>
  <v-col cols="12">
    <v-table v-if="items.length" fixed-header>
      <thead>
        <tr>
          <th v-for="header in headers" :key="header" class="text-center">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id" class="text-center">
          <slot name="body" :item="item"></slot>
        </tr>
      </tbody>
    </v-table>
    <span v-else>{{ emptyMessage }}</span>
  </v-col>
</template>

<script setup>
const props = defineProps({
  emptyMessage: {
    type: String,
    default: "Nenhum resultado encontrado.",
  },
  headers: {
    type: Array,
    default: () => [],
  },
  items: {
    type: Array,
    default: () => [],
  },
});
</script>
