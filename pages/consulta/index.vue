<template>
  <v-row class="ma-5">
    <PageTitle title="Consulta de Protocolo" />
    <v-col cols="12">
      <CoreInput
        v-model="cpf"
        :counter="11"
        clearable
        full-width
        hint="Digite apenas números"
        label="CPF do aluno(a)*"
        persistent-hint
        placeholder="123456789000"
        required
        @input="(cpf = $event), onInputCPF()"
      />
    </v-col>
  </v-row>
  <CoreSnackbar
    v-model="showMessage"
    color="error"
    :message="message"
    @hide="showMessage = $event"
  />
</template>

<script setup>
const cpf = ref(null);
const showMessage = ref(false);
const message = ref("");

const onInputCPF = () => {
  if (cpf.value && cpf.value.length) cpf.value = cpf.value.replace(/\D/g, "");

  if (cpf.value && cpf.value.length == 11) {
    return validateCPF(cpf.value)
      ? carregarAluno()
      : ((message.value = "Erro: CPF Inválido."), (showMessage.value = true));
  }
};

const carregarAluno = async () => {
  const { data: aluno } = await useFetch("/api/alunos", {
    query: {
      cpf: cpf.value,
    },
  });

  console.log("aluno.value :>> ", aluno.value);
};

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
