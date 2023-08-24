<template>
  <CadastroForm
    ref="formCadastro"
    v-model="dadosForm"
    @submit="onClickBuscarVaga($event)"
  />
</template>

<script setup>
const dadosForm = ref({
  cpf: null,
  email: null,
  nome: null,
  dataNascimento: null,
  unidade: null,
  etapa: null,
});

const onClickBuscarVaga = async (aluno) => {
  //Se aluno ainda não existir, deve criar antes de trocar de rota
  console.log("aluno :>> ", aluno);
  console.log("dadosForm.value :>> ", dadosForm.value);
  await navigateTo({
    path: "/cadastro/vagas",
    query: {
      cpf: dadosForm.value.cpf,
      etapa: dadosForm.value.etapa.id,
    },
  });
};
</script>
