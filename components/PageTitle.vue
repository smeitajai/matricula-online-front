<template>
  <v-col :cols="mobile ? 9 : 11">
    <span :class="mobile ? 'text-h5' : 'text-h4'">{{ title }}</span>
  </v-col>
  <v-col :cols="mobile ? 3 : 1">
    <v-row justify="end" class="ma-0">
      <CoreButton
        label="voltar"
        prepend-color="grey"
        prepend-icon="mdi-chevron-left"
        text-color="grey"
        variant="text"
        @click="router.back()"
      />
    </v-row>
  </v-col>
  <v-col v-if="slots.subtitle" cols="12" class="py-0">
    <slot name="subtitle" />
  </v-col>
</template>

<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();
const slots = useSlots();

defineProps({
  title: {
    type: String,
    required: true,
  },
});

const router = useRouter();
</script>
