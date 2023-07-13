<template>
  <v-row class="pa-10">
    <v-col cols="12">
      <span class="text-h4">Matrícula de {{ pessoa.nome }}</span>
      <p>{{ cpf }}</p>
      <v-btn @click="teste">Voltar</v-btn>
    </v-col>
  </v-row>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const cpf = computed(() => route.query.cpf);
const pessoa = {
  cpf: "06632196985",
  nome: "João da Silva",
  dataNascimento: "2020-12-01",
  unidade: "CE PEDRO RIZZI",
  etapa: "2° ano",
};

const teste = () => {
  router.back();
};

onMounted(() => {
  //Deve carregar a pessoa no BackEnd do Matricula Online com base na prop CPF
  //Ou pode armazenar a Pessoa como um estado na tela anterior, e aqui apenas resgatar os dados. (Pinia?)
  console.log("pessoa :>> ", pessoa);
});
</script>
