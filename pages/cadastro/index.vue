<template>
  <CadastroForm
    ref="formCadastro"
    v-model="dadosForm"
    @submit="onClickBuscarVaga"
  />
</template>

<script setup>
const router = useRouter();

const dadosForm = ref({
  cpf: null,
  email: null,
  nome: null,
  dataNascimento: null,
  unidade: null,
  etapa: null,
});

const onClickBuscarVaga = () => {
  //Se cadastro ainda não existir, deve criar a Pessoa antes
  console.log("dadosForm.value :>> ", dadosForm.value);
  router.push({
    path: "/cadastro/vagas",
    query: {
      cpf: dadosForm.value.cpf,
      etapa: dadosForm.value.etapa,
    },
  });
};
</script>
