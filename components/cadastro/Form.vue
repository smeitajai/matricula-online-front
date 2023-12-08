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
        v-model="dadosForm.telefone1"
        clearable
        label="Telefone do responsável (1)"
        placeholder="(99) 99999-9999"
        @input="dadosForm.telefone1 = $event"
      />

      <CoreInput
        v-model="dadosForm.telefone2"
        clearable
        label="Telefone do responsável (2)"
        placeholder="(99) 99999-9999"
        @input="dadosForm.telefone2 = $event"
      />

      <CoreInput
        v-model="dadosForm.nome"
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
        hint="para o ano letivo de 2024"
        item-title="nome"
        label="Etapa*"
        persistent-hint
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

    <CoreDialog
      v-if="showDialog"
      v-model="showDialog"
      persistent
      title="Atenção!"
      toolbar
      :width="600"
    >
      <v-row class="text-center">
        <v-col cols="12">
          O CPF informado está vinculado a um aluno(a) que já está frequentando
          uma unidade de ensino municipal.
        </v-col>
        <v-col cols="12">
          Nesta etapa são permitidas apenas as inscrições de novos alunos.
        </v-col>
        <v-col cols="12">
          Caso necessite fazer a inscrição na etapa
          <span class="font-weight-bold">{{ etapaAtiva.nome || "" }}</span
          >, entre em contato com a Unidade de Ensino para regularizar a
          situação do(a) aluno(a).
        </v-col>
      </v-row>
      <template #dialogActions>
        <CoreButton
          text-color="red-darken-1"
          label="FECHAR"
          variant="text"
          @click="showDialog = false"
        />
      </template>
    </CoreDialog>
  </v-form>
</template>

<script setup>
const { data: etapas } = await useFetch("/api/etapas");
const { data: processo } = await useFetch("/api/processos/em-andamento");

const emit = defineEmits(["submit"]);

const showAllInputs = ref(false);
const showDialog = ref(false);
const showMessage = ref(false);
const message = ref("");
const form = ref(null);
const etapaAtiva = ref(null);
const dadosForm = ref({});
const alunoState = useAluno();

onMounted(() => {
  etapaAtiva.value =
    processo.value && processo.value.processoEtapas
      ? processo.value.processoEtapas.find((etapa) => etapa.emAndamento)
      : null;
});

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
  dadosForm.value = { cpf: dadosForm.value.cpf };
  // Verifica se o aluno existe no Matricula On-line
  const { data: alunoMatriculaOnline } = await useFetch("/api/alunos", {
    query: {
      cpf: dadosForm.value.cpf,
    },
  });
  const aluno = alunoMatriculaOnline.value[0] || null;

  if (
    !alunoMatriculaOnline.value.statusCode &&
    !alunoMatriculaOnline.value.error &&
    alunoMatriculaOnline.value.length
  ) {
    dadosForm.value = { ...aluno };
  }

  if (etapaAtiva.value && aluno) {
    //Verifica se o Aluno já possui inscrição na Etapa Ativa do Processo
    const { data: inscricao } = await useFetch(
      `/api/processo-etapas/${etapaAtiva.value.id}/inscricoes`,
      {
        query: {
          alunoId: aluno.id,
        },
      },
    );

    if (inscricao.value && !inscricao.value.statusCode)
      return (
        (message.value =
          inscricao.value.message ||
          "Erro: Aluno(a) ja possui inscrição nesta etapa."),
        (showMessage.value = true)
      );
  }

  // Verifica se o aluno existe no Erudio e retorna os dados
  const { data: alunoErudio } = await useFetch("/api/alunos-matriculados", {
    query: {
      cpf: dadosForm.value.cpf,
    },
  });

  // Quando é Processo Exclusivamente Interno - Utilizar esse bloco
  // if (
  //   !alunoErudio.value.statusCode &&
  //   !alunoErudio.value.error &&
  //   alunoErudio.value.id
  // ) {
  //   dadosForm.value = {
  //     ...dadosForm.value,
  //     nome: alunoErudio.value.nome,
  //     dataNascimento: alunoErudio.value.dataNascimento,
  //     etapa: etapas.value.find((e) => e.id == alunoErudio.value.etapaId),
  //     unidadeEnsinoId: alunoErudio.value.unidadeEnsinoId,
  //   };

  //   return (showAllInputs.value = true); // Exibe o Form SOMENTE se carregar um aluno do Erudio
  // }

  // Quando​ é Processo Exclusivamente Externo - Utilizar esse bloco
  if (alunoErudio.value && alunoErudio.value.id) {
    return (showAllInputs.value = true); // Exibe o Form SOMENTE se o Aluno Carregado retornar ID
  }

  //Se alunoErudio não retorna id, deve exibir o Dialog de Erro
  showDialog.value = true;
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

  !dadosForm.value.id
    ? criarAluno()
    : emit("submit", {
        alunoId: dadosForm.value.id,
        etapaId: dadosForm.value.etapa.id,
        unidadeEnsinoId: dadosForm.value.unidadeEnsinoId,
      });
};

const criarAluno = async () => {
  const dadosAluno = { ...dadosForm.value };
  delete dadosAluno.id;
  delete dadosAluno.etapa;
  delete dadosAluno.unidadeEnsinoId;
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
    unidadeEnsinoId: dadosForm.value.unidadeEnsinoId,
  });
};
</script>
