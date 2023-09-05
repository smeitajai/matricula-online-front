<template>
  <CadastroForm @submit="onClickBuscarVaga($event)" />
</template>

<script setup>
const onClickBuscarVaga = async (aluno) => {
  //Se aluno ainda não existir, deve criar antes de trocar de rota
  console.log("aluno :>> ", aluno);
  await navigateTo({
    path: "/cadastro/vagas",
    query: {
      cpf: aluno.cpf,
      etapa: aluno.etapa.id,
    },
  });
};
</script>
