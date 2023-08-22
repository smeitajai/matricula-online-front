<template>
  <CadastroForm
    ref="formCadastro"
    v-model="dadosForm"
    @submit="onClickBuscarVaga"
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

const onClickBuscarVaga = async () => {
  //Se cadastro ainda não existir, deve criar a Pessoa antes
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
