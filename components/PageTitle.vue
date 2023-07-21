<template>
  <v-col :cols="mobile ? 9 : 11">
    <span class="text-h4">{{ title }}</span>
  </v-col>
  <v-col :cols="mobile ? 3 : 1">
    <CoreButton
      label="voltar"
      icon="mdi-chevron-left"
      text-color="grey"
      icon-color="grey"
      variant="text"
      @click="router.back()"
    />
  </v-col>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});

const mobile = useMobile();
const router = useRouter();
</script>
