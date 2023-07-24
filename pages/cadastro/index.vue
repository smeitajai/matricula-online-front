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
  router.push({
    path: "/cadastro/vagas",
    query: {
      cpf: dadosForm.value.cpf,
    },
  });
};
</script>
