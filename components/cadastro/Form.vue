<template>
  <v-form ref="form" class="pa-10">
    <v-row class="mb-3">
      <CoreInput
        v-model="dadosForm.cpf"
        :counter="11"
        clearable
        full-width
        hint="Digite apenas números"
        label="CPF do aluno(a)*"
        persistent-hint
        placeholder="123456789000"
        required
        @input="(dadosForm.cpf = $event), onInputCPF()"
      />
    </v-row>
    <v-row v-if="showAllInputs">
      <CoreInput
        v-model="dadosForm.email"
        autofocus
        clearable
        full-width
        label="E-mail do responsável"
        placeholder="email@email.com"
        @input="dadosForm.email = $event"
      />

      <CoreInput
        v-model="dadosForm.nome"
        clearable
        label="Nome do aluno(a)*"
        required
        full-width
        @input="dadosForm.nome = $event"
      />

      <CoreInput
        v-model="dadosForm.dataNascimento"
        label="Data de nascimento*"
        type="date"
        required
        @input="dadosForm.dataNascimento = $event"
      />

      <CoreSelect
        v-model="dadosForm.etapa"
        :items="etapas"
        :disabled="!!dadosForm.id"
        item-title="nome"
        label="Etapa*"
        required
        @input="dadosForm.etapa = $event"
      />
    </v-row>

    <v-row v-if="showAllInputs" justify="end">
      <CoreButton
        label="buscar vaga"
        prepend-icon="mdi-magnify"
        @click="onSubmit()"
      />
    </v-row>

    <CoreSnackbar
      v-model="showMessage"
      color="error"
      :message="message"
      @hide="showMessage = $event"
    />
  </v-form>
</template>

<script setup>
const { data: etapas } = await useFetch("/api/etapas");

onMounted(() => {
  if (etapas.value && etapas.value.error) {
    message.value = etapas.value.message;
    return (showMessage.value = true);
  }
});

const emit = defineEmits(["submit"]);

const showAllInputs = ref(false);
const showMessage = ref(false);
const message = ref("");
const form = ref(null);
const dadosForm = ref({});
const alunoState = useAluno();

const onInputCPF = () => {
  showAllInputs.value = false;

  if (dadosForm.value.cpf && dadosForm.value.cpf.length)
    dadosForm.value.cpf = dadosForm.value.cpf.replace(/\D/g, "");

  if (dadosForm.value.cpf && dadosForm.value.cpf.length == 11) {
    return validateCPF(dadosForm.value.cpf)
      ? carregarAluno()
      : ((message.value = "Erro: CPF Inválido."), (showMessage.value = true));
  }
};

const carregarAluno = async () => {
  const { data: aluno } = await useFetch("/api/alunos-matriculados", {
    query: {
      cpf: dadosForm.value.cpf,
    },
  });

  if (!aluno.value.statusCode && !aluno.value.error)
    dadosForm.value = {
      id: aluno.value.id,
      cpf: aluno.value.cpf,
      nome: aluno.value.nome,
      dataNascimento: aluno.value.dataNascimento,
      etapa: etapas.value.find((e) => e.id == aluno.value.etapaId),
    };

  showAllInputs.value = true;
};

const onSubmit = async () => {
  const { valid } = await form.value.validate();
  if (!valid)
    return (
      (message.value = "Verifique os campos obrigatórios e tente novamente."),
      (showMessage.value = true)
    );

  if (dadosForm.value.email && !validateEmail(dadosForm.value.email))
    return (
      (message.value = "Erro: E-mail inválido."), (showMessage.value = true)
    );

  if (dadosForm.value.email && !dadosForm.value.email.length)
    delete dadosForm.value.email;

  criarAluno();

  // Precisa validar quando deve criar aluno e quando aluno já está criado
  // !dadosForm.value.id
  //   ? criarAluno()
  //   : emit("submit", {
  //       alunoId: dadosForm.value.id,
  //       etapaId: dadosForm.value.etapa.id,
  //     });
};

const criarAluno = async () => {
  const dadosAluno = { ...dadosForm.value };
  delete dadosAluno.id;
  delete dadosAluno.etapa;
  const { data: alunoCriado, error } = await useFetch("/api/alunos", {
    method: "POST",
    body: dadosAluno,
  });

  if (error.value || alunoCriado.value.statusCode) {
    message.value = error.value || alunoCriado.value.message;
    return (showMessage.value = true);
  }

  alunoState.value = alunoCriado.value; // Grava o aluno criado no State

  emit("submit", {
    alunoId: alunoCriado.value.id,
    etapaId: dadosForm.value.etapa.id,
  });
};
</script>
