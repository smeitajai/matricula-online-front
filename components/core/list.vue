<template>
  <CoreCard
    :elevation="elevation"
    :title="header"
    :toolbar="toolbar"
    padding-none
  >
    <v-list v-if="items && items.length" :lines="lines">
      <template v-for="(item, index) in items" :key="item.id">
        <v-list-item :value="item" @click="onClickItem(item)">
          <v-list-item-title v-if="itemText">{{
            itemText(item)
          }}</v-list-item-title>
          <v-list-item-title v-if="itemTextTitle && !itemText">
            <slot name="itemTextTitle" :item="item" />
          </v-list-item-title>
          <v-list-item-subtitle v-if="itemTextSub">
            {{ itemTextSub(item) }}
          </v-list-item-subtitle>
          <v-list-item-subtitle v-if="itemTextSubtitle && !itemTextSub">
            <slot name="itemTextSubtitle" :item="item" />
          </v-list-item-subtitle>
          <template #append>
            <v-spacer></v-spacer>
            <slot name="actions" :item="item" />
          </template>
        </v-list-item>
        <v-divider
          v-if="index < items.length - 1"
          :key="`divider_${item.id}`"
          class="my-2"
        />
      </template>
    </v-list>
    <span v-else class="pa-2">Nenhum resultado encontrado.</span>
  </CoreCard>
</template>

<script setup>
defineProps({
  elevation: {
    type: Number,
    default: 2,
  },
  header: {
    type: String,
    default: "",
  },
  items: {
    type: Array,
    required: true,
  },
  itemText: {
    type: Function,
    default: null,
  },
  itemTextTitle: {
    type: Boolean,
    default: false,
  },
  itemTextSub: {
    type: Function,
    default: null,
  },
  itemTextSubtitle: {
    type: Boolean,
    default: false,
  },
  lines: {
    type: String,
    default: "one",
  },
  toolbar: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

const onClickItem = (item) => {
  emit("click", item);
};
</script>
