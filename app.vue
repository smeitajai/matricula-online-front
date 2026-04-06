<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
useHead({
  title: "Portal de Matrículas",
  meta: [
    {
      name: "description",
      content: "Sistema de matrícula online do município de Itajaí/SC",
    },
  ],
});
</script>
