<template>
  <v-form ref="form" class="pa-10">
    <v-row class="mb-3">
      <CoreInput
        v-model="dadosForm.cpf"
        :counter="11"
        :disabled="!etapaAtiva"
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
        v-model="dadosForm.responsavelNome"
        autofocus
        clearable
        label="Nome do(a) responsável*"
        required
        @input="dadosForm.responsavelNome = $event"
      />
      <CoreInput
        v-model="dadosForm.email"
        clearable
        label="E-mail do(a) responsável"
        placeholder="email@email.com"
        @input="dadosForm.email = $event"
      />

      <CoreInput
        v-model="dadosForm.telefone1"
        clearable
        label="Telefone do(a) responsável (1)"
        placeholder="(99) 99999-9999"
        @input="dadosForm.telefone1 = $event"
      />

      <CoreInput
        v-model="dadosForm.telefone2"
        clearable
        label="Telefone do(a) responsável (2)"
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
        :hint="`para o ano letivo de ${ANO_INSCRICAO}`"
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

    <CadastroDialogProcessoExterno
      :dialog="showDialogProcessoExterno"
      :etapa-ativa="etapaAtiva"
      @close="showDialogProcessoExterno = $event"
    />

    <CadastroDialogProcessoInterno
      :dialog="showDialogProcessoInterno"
      :etapa-ativa="etapaAtiva"
      @close="showDialogProcessoInterno = $event"
    />
  </v-form>
</template>

<script setup>
const { data: etapas } = await useFetch("/api/etapas");
const { data: processo } = await useFetch("/api/processos/em-andamento");

const emit = defineEmits(["submit"]);

const ANO_INSCRICAO = new Date().getFullYear() + 1;

const showAllInputs = ref(false);
const showDialogProcessoExterno = ref(false);
const showDialogProcessoInterno = ref(false);
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

  if (!etapaAtiva.value) {
    message.value = "Erro: Nenhuma etapa em andamento.";
    return (showMessage.value = true);
  }
});

const onInputCPF = () => {
  showAllInputs.value = false;

  if (dadosForm.value.cpf && dadosForm.value.cpf.length)
    dadosForm.value.cpf = dadosForm.value.cpf.replace(/\D/g, "");

  if (dadosForm.value.cpf && dadosForm.value.cpf.length == 11) {
    return validateCPF(dadosForm.value.cpf)
      ? validarInscricao()
      : ((message.value = "Erro: CPF Inválido."), (showMessage.value = true));
  }
};

const carregarAlunoMatriculaOnline = async () => {
  // Verifica se o aluno existe no Matricula On-line
  const { data, error } = await useFetch("/api/alunos", {
    query: {
      cpf: dadosForm.value.cpf,
    },
  });

  if (error.value || data.value.statusCode || data.value.error) {
    message.value = error.value || data.value.error || data.value.message;
    return (showMessage.value = true);
  }

  const aluno = data.value && data.value.length ? data.value[0] : null;
  return aluno;
};

const possuiInscricaoEtapaAtiva = async (aluno) => {
  // Verificar se o aluno já está inscrito na etapa ativa
  const { data: inscricao, error } = await useFetch(
    `/api/processo-etapas/${etapaAtiva.value.id}/inscricoes`,
    {
      query: {
        alunoId: aluno.id,
      },
    },
  );

  if (error.value || inscricao.value.statusCode || inscricao.value.error) {
    message.value =
      error.value || inscricao.value.error || inscricao.value.message;
    return (showMessage.value = true);
  }

  return inscricao.value;
};

const carregarAlunoErudio = async () => {
  // Verifica se o aluno existe no Erudio
  const { data: alunoErudio } = await useFetch("/api/alunos-matriculados", {
    query: {
      cpf: dadosForm.value.cpf,
    },
  });

  return alunoErudio.value;
};

const validarInscricao = async () => {
  dadosForm.value = { cpf: dadosForm.value.cpf }; // ?????????

  if (!etapaAtiva.value)
    // Não permite seguir se não houver etapa em andamento
    return (
      (message.value = "Erro: Nenhuma etapa em andamento."),
      (showMessage.value = true)
    );

  const aluno = await carregarAlunoMatriculaOnline(); // Verifica se o aluno existe no Matricula On-line

  if (aluno) {
    dadosForm.value = { ...aluno };
    const possuiInscricao = await possuiInscricaoEtapaAtiva(aluno); //Verifica se o aluno já possui inscrição na Etapa Ativa do Processo

    if (possuiInscricao) {
      return (
        (message.value =
          possuiInscricao.message ||
          "Erro: Aluno(a) já está inscrito nesta etapa do processo."),
        (showMessage.value = true)
      );
    }
  }

  const alunoErudio = await carregarAlunoErudio(); // Verifica se o aluno existe no Erudio

  //Quando é Processo Exclusivamente Interno - Utilizar esse bloco
  if (!alunoErudio.statusCode && !alunoErudio.error && alunoErudio.cpf) {
    dadosForm.value = {
      ...dadosForm.value,
      cpf: alunoErudio.cpf,
      nome: alunoErudio.nome,
      responsavelNome: alunoErudio.responsavelNome,
      dataNascimento: alunoErudio.dataNascimento,
      //etapa: etapas.value.find((e) => e.id == alunoErudio.etapaId),
      //unidadeEnsinoId: alunoErudio.unidadeEnsinoId,
      unidadeEnsinoId: "061e152e-600a-467e-b90b-3c51beb6a3a8",
    };

    console.log("dadosForm.value FINAL :>> ", dadosForm.value);

    return (showAllInputs.value = true); // Exibe o Form SOMENTE se carregar um aluno do Erudio
  }

  // Se alunoErudio não retorna cpf, deve exibir o Dialog de Erro de Processo Interno
  showDialogProcessoInterno.value = true;
  // Fim do Bloco de Processo Interno

  // Quando​ é Processo Exclusivamente Externo --- Utilizar esse bloco ---
  // if (!alunoErudio.statusCode && !alunoErudio.error && !alunoErudio.cpf) {
  //   return (showAllInputs.value = true); // Exibe o Form somente se NÃO retornar um aluno (cpf) do Erudio
  // }
  // showDialogProcessoExterno = true;
  // Fim do Bloco de Processo Externo
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

  dadosForm.value.id ? editarAluno() : criarAluno();
};

const editarAluno = async () => {
  const dadosAluno = { ...dadosForm.value };
  delete dadosAluno.etapa;
  delete dadosAluno.unidadeEnsinoId;

  const { data: alunoEditado, error } = await useFetch("/api/alunos", {
    method: "PUT",
    body: dadosAluno,
  });

  if (error.value || alunoEditado.value.statusCode) {
    message.value = error.value || alunoEditado.value.message;
    return (showMessage.value = true);
  }

  emit("submit", {
    alunoId: alunoEditado.value.id,
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
