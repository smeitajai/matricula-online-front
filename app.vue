<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
useHead({
  title: "Matrícula Online",
  meta: [
    {
      name: "description",
      content: "Sistema de matrícula online do município de Itajaí/SC",
    },
  ],
});
</script>
