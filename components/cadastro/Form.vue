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
        @input="((dadosForm.cpf = $event), onInputCPF())"
      />
    </v-row>
    <template v-if="loading">
      <v-row v-for="n in 4" :key="n" class="align-skeleton-loading">
        <v-col cols="6" class="py-0">
          <v-skeleton-loader type="text"></v-skeleton-loader>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-skeleton-loader type="text"></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12"
          ><v-skeleton-loader
            class="justify-end"
            type="button"
          ></v-skeleton-loader></v-col
      ></v-row>
    </template>
    <v-row v-if="showAllInputs">
      <CoreInput
        v-model="dadosForm.responsavelNome"
        autofocus
        clearable
        disabled
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
        required
        @input="dadosForm.telefone1 = $event"
      />

      <CoreInput
        v-model="dadosForm.telefone2"
        clearable
        label="Telefone do(a) responsável (2)"
        placeholder="(99) 99999-9999"
        required
        @input="dadosForm.telefone2 = $event"
      />

      <CoreInput
        v-model="dadosForm.nome"
        disabled
        label="Nome do aluno(a)*"
        required
        @input="dadosForm.nome = $event"
      />

      <CoreInput
        v-model="dadosForm.dataNascimento"
        disabled
        label="Data de nascimento*"
        type="date"
        required
        @input="dadosForm.dataNascimento = $event"
      />

      <!-- <CoreSelect
        v-model="dadosForm.etapa"
        :items="etapas"
        :hint="`para o ano letivo de ${ANO_INSCRICAO}`"
        item-title="nome"
        label="Etapa*"
        persistent-hint
        required
        @input="dadosForm.etapa = $event"
      /> -->

      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>

      <v-col cols="12">
        <p>
          Informe os documentos, conforme item 2.2.4 do Edital de Matrícula
          2026.
        </p>
        <p class="font-italic text-body-2">
          Os documentos marcados com (*) são obrigatórios
        </p>
      </v-col>

      <CoreFileInput
        v-model="documentos.certidao_identidade"
        chips
        clearable
        label="Certidão de nascimento ou documento de identidade do estudante*"
        required
      />

      <CoreFileInput
        v-model="documentos.cpf_rg_responsavel1"
        chips
        clearable
        counter
        label="CPF e RG do responsável 1*"
        required
      />

      <CoreFileInput
        v-model="documentos.cpf_rg_responsavel2"
        chips
        clearable
        counter
        label="CPF e RG do responsável 2"
      />

      <CoreFileInput
        v-model="documentos.comprovante_residencia"
        chips
        clearable
        label="Comprovante de residência*"
        required
      />

      <CoreFileInput
        v-model="documentos.foto_estudante"
        chips
        clearable
        label="Foto do(a) estudante (Rosto com fundo branco)*"
        required
      />

      <CoreFileInput
        v-model="documentos.declaracao_vacinacao"
        chips
        clearable
        label="Declaração de vacinação"
        @input="documentos.declaracao_vacinacao = $event"
      />

      <CoreFileInput
        v-model="documentos.cartao_cns"
        chips
        clearable
        label="Cartão Nacional de Saúde (CNS)"
        @input="documentos.cartao_cns = $event"
      />

      <CoreFileInput
        v-model="documentos.cartao_social"
        chips
        clearable
        label="Cartão Social (NIS)"
        @input="documentos.cartao_social = $event"
      />

      <CoreFileInput
        v-model="documentos.cartao_bpc"
        chips
        clearable
        label="Cartão Benefício de Prestação Continuada (BPC)"
        @input="documentos.cartao_bpc = $event"
      />

      <CoreFileInput
        v-model="documentos.tutela_provisoria"
        chips
        clearable
        label="Tutela provisória"
        @input="documentos.tutela_provisoria = $event"
      />

      <CoreFileInput
        v-model="documentos.laudo_medico"
        chips
        clearable
        label="Laudo Médico"
        @input="documentos.laudo_medico = $event"
      />
    </v-row>

    <v-row v-if="showAllInputs" justify="end">
      <CoreButton
        label="salvar"
        prepend-icon="mdi-content-save"
        :loading="loadingButton"
        @click="onSubmit()"
      />
    </v-row>

    <CoreSnackbar
      v-model="showMessage"
      color="error"
      :message="message"
      :timeout="timeout"
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

//const ANO_INSCRICAO = new Date().getFullYear() + 1;

const showAllInputs = ref(false);
const showDialogProcessoExterno = ref(false);
const showDialogProcessoInterno = ref(false);
const showMessage = ref(false);
const message = ref("");
const form = ref(null);
const etapaAtiva = ref(null);
const dadosForm = ref({});
const documentos = ref({});
const loading = ref(false);
const loadingButton = ref(false);
const timeout = ref(5000);
const inscricaoAtiva = ref(null);
const alunoCarregadoErudio = ref(null);
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

const onInputCPF = async () => {
  showAllInputs.value = false;

  if (dadosForm.value.cpf && dadosForm.value.cpf.length)
    dadosForm.value.cpf = dadosForm.value.cpf.replace(/\D/g, "");

  if (dadosForm.value.cpf && dadosForm.value.cpf.length == 11) {
    return validateCPF(dadosForm.value.cpf)
      ? await validarInscricao()
      : ((message.value = "Erro: CPF Inválido."), (showMessage.value = true));
  }
};

const carregarAlunoMatriculaOnline = async () => {
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
  const { data: alunoErudio, error } = await useFetch(
    "/api/alunos-matriculados",
    {
      query: {
        cpf: dadosForm.value.cpf,
        ordem: etapaAtiva.value.ordem,
      },
    },
  );

  if (error.value || alunoErudio.value.statusCode || alunoErudio.value.error) {
    message.value =
      error.value || alunoErudio.value.error || alunoErudio.value.message;
    showMessage.value = true;
    return null;
  }

  return alunoErudio.value;
};

const validarInscricao = async () => {
  dadosForm.value = { cpf: dadosForm.value.cpf };

  if (!etapaAtiva.value)
    return (
      (message.value = "Erro: Nenhuma etapa em andamento."),
      (showMessage.value = true)
    );

  loading.value = true;
  const aluno = await carregarAlunoMatriculaOnline(); // Verifica se o aluno existe no Matricula On-line

  if (aluno) {
    dadosForm.value = { ...aluno };
    inscricaoAtiva.value = await possuiInscricaoEtapaAtiva(aluno); // Verifica se já possui inscricao na etapa ativa

    if (inscricaoAtiva.value.hasOwnProperty("message")) {
      loading.value = false;
      message.value =
        inscricaoAtiva.value.message ||
        "Erro: Aluno(a) já está inscrito nesta etapa do processo.";

      showMessage.value = true;
      return;
    }
  }

  const alunoErudio = await carregarAlunoErudio(); // Verifica se o aluno existe no Erudio
  alunoCarregadoErudio.value = alunoErudio;

  loading.value = false;

  // Se etapa INTERNO
  if (etapaAtiva.value.categoria === "INTERNO") {
    if (
      alunoErudio &&
      !alunoErudio.statusCode &&
      !alunoErudio.error &&
      alunoErudio.cpf
    ) {
      if (
        !alunoErudio.etapaProximoAnoId ||
        !alunoErudio.turnoProximoAnoId ||
        !alunoErudio.unidadeEnsinoProximoAnoId
      ) {
        // Se não tiver Etapa, Turno ou Unidade do Proximo Ano, mostra erro e não deixa seguir
        message.value =
          "Erro: Aluno(a) não possui etapa, turno ou unidade do próximo ano.";
        timeout.value = 10000;
        showMessage.value = true;
        return;
      }

      dadosForm.value = {
        ...dadosForm.value,
        cpf: alunoErudio.cpf,
        nome: alunoErudio.nome,
        responsavelNome: alunoErudio.responsavelNome,
        dataNascimento: alunoErudio.dataNascimento,
        etapa: etapas.value.find((e) => e.id == alunoErudio.etapaId),
        unidadeEnsinoId: alunoErudio.unidadeEnsinoId,
      };

      return (showAllInputs.value = true); // Exibe o Form SOMENTE se carregar um aluno do Erudio
    }
    // Se não carregar um aluno do Erudio, deve exibir o Dialog de Erro de Processo Interno
    return (showDialogProcessoInterno.value = true);
  }

  // Se etapa EXTERNO
  if (etapaAtiva.value.categoria === "EXTERNO") {
    if (!alunoErudio.statusCode && !alunoErudio.error && alunoErudio.id) {
      return (showAllInputs.value = true); // Exibe o Form somente se NÃO retornar um aluno do Erudio
    }
    // Se carregar um aluno do Erudio, deve exibir o Dialog informando que a etapa é externa
    return (showDialogProcessoExterno.value = true);
  }

  // Se etapa GERAL
  if (etapaAtiva.value.categoria === "GERAL") {
    message.value = "Erro: Etapa ativa não pode ser da categoria: GERAL.";
    return (showMessage.value = true);
  }
};

const onSubmit = async () => {
  if (inscricaoAtiva.value) {
    message.value = "Erro: Aluno(a) já está inscrito nesta etapa do processo.";
    return (showMessage.value = true);
  }

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

  loadingButton.value = true;

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
    loadingButton.value = false;
    return (showMessage.value = true);
  }

  salvarInscricao();

  // emit("submit", {
  //   alunoId: alunoEditado.value.id,
  //   etapaId: dadosForm.value.etapa.id,
  //   unidadeEnsinoId: dadosForm.value.unidadeEnsinoId,
  // });
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
    loadingButton.value = false;
    return (showMessage.value = true);
  }

  alunoState.value = alunoCriado.value; // Grava o aluno criado no State

  salvarInscricao();

  // emit("submit", {
  //   alunoId: alunoCriado.value.id,
  //   etapaId: dadosForm.value.etapa.id,
  //   unidadeEnsinoId: dadosForm.value.unidadeEnsinoId,
  // });
};

const salvarInscricao = async () => {
  const { data: inscricaoCriada, error } = await useFetch("/api/inscricoes", {
    method: "POST",
    body: {
      alunoId: alunoState.value.id.toString(),
      processoEtapaId: etapaAtiva.value.id,
      unidadeEnsinoProximoAnoId:
        alunoCarregadoErudio.value.unidadeEnsinoProximoAnoId?.toString() ||
        "16142",
      etapaProximoAnoId:
        alunoCarregadoErudio.value.etapaProximoAnoId?.toString() || "1",
      turnoProximoAnoId:
        alunoCarregadoErudio.value.turnoProximoAnoId?.toString() || "1",
    },
  });

  if (error.value || inscricaoCriada.value.statusCode) {
    message.value = error.value || inscricaoCriada.value.message;
    loadingButton.value = false;
    return (showMessage.value = true);
  }

  salvarDocumentos(inscricaoCriada.value);
};

const normalizeFiles = (value) => {
  // Normaliza os arquivos para um array
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
};

const salvarDocumentos = async (inscricao) => {
  const formData = new FormData();
  formData.append("inscricaoId", inscricao.id);

  Object.values(documentos.value).forEach((valor) => {
    const arquivos = normalizeFiles(valor);
    arquivos.forEach((arquivo) => formData.append("files", arquivo));
  });

  const { data: anexos, error } = await useFetch("/api/anexos", {
    method: "POST",
    body: formData,
  });

  if (error.value || anexos.value.statusCode) {
    message.value = error.value || anexos.value.message;
    loadingButton.value = false;
    return (showMessage.value = true);
  }

  gerarprotocolo(inscricao);
};

const gerarprotocolo = async (inscricao) => {
  await navigateTo({
    path: "/protocolo",
    query: {
      inscricao: inscricao.id,
    },
  });
};
</script>

<style scoped>
.align-skeleton-loading :nth-child(1),
.align-skeleton-loading :nth-child(2) {
  margin-top: 12px;
}
</style>
