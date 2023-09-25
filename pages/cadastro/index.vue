<template>
  <CadastroForm @submit="onClickBuscarVaga($event)" />
</template>

<script setup>
useClearState();
const onClickBuscarVaga = async (item) => {
  await navigateTo({
    path: "/cadastro/vagas",
    query: {
      aluno: item.alunoId,
      etapa: item.etapaId,
    },
  });
};
</script>
