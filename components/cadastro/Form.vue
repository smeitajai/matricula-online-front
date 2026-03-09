<template>
  <v-form ref="form" class="pa-10">
    <v-row class="mb-3">
      <CoreSelect
        v-model="opcaoProcessoSelecionada"
        :items="opcoesProcesso"
        full-width
        item-title="nome"
        label="Tipo de cadastro*"
        required
        @input="onChangeOpcaoProcesso"
      />
    </v-row>

    <v-row
      v-if="isEtapaAtivaSelecionada || isPreCadastroSelecionado"
      class="mb-3"
    >
      <CoreInput
        v-model="dadosForm.cpf"
        :counter="11"
        :disabled="isEtapaAtivaSelecionada && !etapaAtiva"
        clearable
        full-width
        hint="Digite apenas números"
        label="CPF do aluno(a)*"
        persistent-hint
        placeholder="123456789000"
        required
        @input="((dadosForm.cpf = $event), onInputCPFPorTipo())"
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
    <CadastroPreCadastroForm
      v-if="showAllInputs && isPreCadastroSelecionado"
      :endereco="dadosEndereco"
      :form-data="dadosForm"
      :genero-options="generoOptions"
      :is-cpf-cnpj-obrigatorio="isCpfCnpjObrigatorio"
      :is-protocolo-cpf-obrigatorio="isProtocoloCpfObrigatorio"
      :nacionalidade-options="nacionalidadeOptions"
      @update:form-data="dadosForm = $event"
      @update:endereco="dadosEndereco = $event"
      @validate-address="validateAddress = $event"
    />

    <v-row v-if="showAllInputs && isEtapaAtivaSelecionada">
      <CoreFormSubtitle label="Responsável" />
      <CoreInput
        v-model="dadosForm.responsavelNome"
        autofocus
        clearable
        label="Nome do(a) responsável*"
        required
        @input="dadosForm.responsavelNome = $event"
      />
      <CoreInput
        v-model="dadosForm.cpfResponsavel"
        :counter="11"
        clearable
        hint="Digite apenas números"
        label="CPF do(a) responsável"
        persistent-hint
        placeholder="12345678901"
        @input="dadosForm.cpfResponsavel = $event"
      />
      <CoreInput
        v-model="dadosForm.email"
        clearable
        label="E-mail do(a) responsável"
        placeholder="email@email.com"
        @input="dadosForm.email = $event"
      />
      <CoreInput
        v-model="dadosForm.conselheiroNome"
        clearable
        label="Nome do(a) conselheiro(a)"
        @input="dadosForm.conselheiroNome = $event"
      />

      <CoreFormSubtitle label="Aluno(a)" />
      <CoreInput
        v-model="dadosForm.nome"
        label="Nome do aluno(a)*"
        required
        @input="dadosForm.nome = $event"
      />

      <CoreInput
        v-model="dadosForm.dataNascimento"
        label="Data de nascimento*"
        type="date"
        required
        @input="dadosForm.dataNascimento = $event"
      />
      <v-col cols="12" class="py-1 px-1" md="6">
        <v-select
          v-model="dadosForm.genero"
          :items="generoOptions"
          item-title="label"
          item-value="value"
          label="Gênero*"
          :rules="[(v) => !!v || 'Campo obrigatório']"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" class="py-1 px-1" md="6">
        <v-select
          v-model="dadosForm.nacionalidade"
          :items="nacionalidadeOptions"
          item-title="label"
          item-value="value"
          label="Nacionalidade*"
          :rules="[(v) => !!v || 'Campo obrigatório']"
          variant="outlined"
        />
      </v-col>
      <CoreInput
        v-model="dadosForm.cpfCnpj"
        :counter="14"
        :required="isCpfCnpjObrigatorio"
        clearable
        hint="Digite apenas números"
        label="CPF/CNPJ"
        persistent-hint
        @input="dadosForm.cpfCnpj = $event"
      />
      <CoreInput
        v-model="dadosForm.protocoloRequerimentoCpf"
        :required="isProtocoloCpfObrigatorio"
        clearable
        label="Protocolo de requerimento do CPF"
        @input="dadosForm.protocoloRequerimentoCpf = $event"
      />
      <CoreInput
        v-model="dadosForm.estadoCivilId"
        clearable
        label="ID do estado civil"
        type="number"
        @input="dadosForm.estadoCivilId = $event"
      />
      <CoreInput
        v-model="dadosForm.racaId"
        clearable
        label="ID da raça/cor"
        type="number"
        @input="dadosForm.racaId = $event"
      />
      <CoreInput
        v-model="dadosForm.paisOrigemId"
        clearable
        label="ID do país de origem"
        type="number"
        @input="dadosForm.paisOrigemId = $event"
      />
      <CoreInput
        v-model="dadosForm.naturalidadeId"
        clearable
        label="ID da naturalidade"
        type="number"
        @input="dadosForm.naturalidadeId = $event"
      />
      <CoreInput
        v-model="dadosForm.registroCivil"
        clearable
        label="Registro civil"
        @input="dadosForm.registroCivil = $event"
      />
      <v-col cols="12" class="py-1 px-1">
        <v-checkbox
          v-model="dadosForm.nomeSocial"
          color="primary"
          hide-details
          label="Aluno(a) utiliza nome social"
        />
      </v-col>

      <CoreFormSubtitle label="Filiação" />
      <CoreInput
        v-model="dadosForm.nomeMae"
        clearable
        label="Nome da mãe"
        @input="dadosForm.nomeMae = $event"
      />
      <CoreInput
        v-model="dadosForm.cpfMae"
        :counter="11"
        clearable
        hint="Digite apenas números"
        label="CPF da mãe"
        persistent-hint
        @input="dadosForm.cpfMae = $event"
      />
      <CoreInput
        v-model="dadosForm.nomePai"
        clearable
        label="Nome do pai"
        @input="dadosForm.nomePai = $event"
      />
      <CoreInput
        v-model="dadosForm.cpfPai"
        :counter="11"
        clearable
        hint="Digite apenas números"
        label="CPF do pai"
        persistent-hint
        @input="dadosForm.cpfPai = $event"
      />

      <CoreFormSubtitle label="Documentos" />
      <CoreInput
        v-model="dadosForm.numeroRg"
        clearable
        label="Número do RG"
        @input="dadosForm.numeroRg = $event"
      />
      <CoreInput
        v-model="dadosForm.orgaoExpedidorRg"
        clearable
        label="Órgão expedidor do RG"
        @input="dadosForm.orgaoExpedidorRg = $event"
      />
      <CoreInput
        v-model="dadosForm.dataExpedicaoRg"
        clearable
        label="Data de expedição do RG"
        type="date"
        @input="dadosForm.dataExpedicaoRg = $event"
      />
      <CoreInput
        v-model="dadosForm.certidaoNascimento"
        clearable
        label="Certidão de nascimento"
        @input="dadosForm.certidaoNascimento = $event"
      />
      <CoreInput
        v-model="dadosForm.dataExpedicaoCertidaoNascimento"
        clearable
        label="Data de expedição da certidão"
        type="date"
        @input="dadosForm.dataExpedicaoCertidaoNascimento = $event"
      />
      <CoreInput
        v-model="dadosForm.nis"
        clearable
        label="NIS"
        @input="dadosForm.nis = $event"
      />
      <CoreInput
        v-model="dadosForm.pisPasep"
        clearable
        label="PIS/PASEP"
        @input="dadosForm.pisPasep = $event"
      />

      <CoreFormSubtitle label="Endereço" />
      <CoreAddress
        v-model="dadosEndereco"
        @validate="validateAddress = $event"
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

      <template v-if="isEtapaAtivaSelecionada">
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
      </template>
    </v-row>

    <v-row v-if="showAllInputs && isEtapaAtivaSelecionada" justify="end">
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
const opcaoProcessoSelecionada = ref(null);
const etapaAtiva = ref(null);
const dadosForm = ref(createEmptyDadosForm());
const dadosEndereco = ref(createEmptyEndereco());
const documentos = ref({});
const loading = ref(false);
const loadingButton = ref(false);
const timeout = ref(5000);
const hasInscricaoAtiva = ref(false);
const alunoCarregadoErudio = ref(null);
const alunoState = useAluno();
const validateAddress = ref(true);

const OPCAO_PRE_CADASTRO_ID = "pre-cadastro";
const generoOptions = [
  { label: "Masculino", value: "M" },
  { label: "Feminino", value: "F" },
];

const nacionalidadeOptions = [
  { label: "Brasileiro", value: "BRASILEIRO" },
  { label: "Naturalizado", value: "NATURALIZADO" },
  { label: "Estrangeiro", value: "ESTRANGEIRO" },
];

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

const opcoesProcesso = computed(() => {
  const etapasEmAndamento =
    processo.value && processo.value.processoEtapas
      ? processo.value.processoEtapas.filter((etapa) => etapa.emAndamento)
      : [];

  return [
    { id: OPCAO_PRE_CADASTRO_ID, nome: "Pré cadastro" },
    ...etapasEmAndamento,
  ];
});

const isEtapaAtivaSelecionada = computed(
  () =>
    !!opcaoProcessoSelecionada.value &&
    opcaoProcessoSelecionada.value.id !== OPCAO_PRE_CADASTRO_ID,
);

const isPreCadastroSelecionado = computed(
  () => opcaoProcessoSelecionada.value?.id === OPCAO_PRE_CADASTRO_ID,
);

const isCpfCnpjObrigatorio = computed(
  () => dadosForm.value.nacionalidade !== "ESTRANGEIRO",
);

const isProtocoloCpfObrigatorio = computed(
  () =>
    dadosForm.value.nacionalidade === "ESTRANGEIRO" && !dadosForm.value.cpfCnpj,
);

const limparEstadoFormulario = () => {
  showAllInputs.value = false;
  showDialogProcessoExterno.value = false;
  showDialogProcessoInterno.value = false;
  dadosForm.value = createEmptyDadosForm();
  dadosEndereco.value = createEmptyEndereco();
  documentos.value = {};
  loading.value = false;
  loadingButton.value = false;
  timeout.value = 5000;
  hasInscricaoAtiva.value = false;
  alunoCarregadoErudio.value = null;
  validateAddress.value = true;
};

const onChangeOpcaoProcesso = (opcao) => {
  opcaoProcessoSelecionada.value = opcao;
  limparEstadoFormulario();

  etapaAtiva.value = opcao && opcao.id !== OPCAO_PRE_CADASTRO_ID ? opcao : null;
};

const onInputCPFPorTipo = async () => {
  if (isEtapaAtivaSelecionada.value) {
    return onInputCPFEtapaAtiva();
  }

  if (isPreCadastroSelecionado.value) {
    return onInputCPFPreCadastro();
  }
};

const onInputCPFEtapaAtiva = async () => {
  showAllInputs.value = false;

  if (dadosForm.value.cpf && dadosForm.value.cpf.length)
    dadosForm.value.cpf = dadosForm.value.cpf.replace(/\D/g, "");
  dadosForm.value.cpfCnpj = dadosForm.value.cpf;

  if (dadosForm.value.cpf && dadosForm.value.cpf.length == 11) {
    return validateCPF(dadosForm.value.cpf)
      ? await validarInscricao()
      : ((message.value = "Erro: CPF Inválido."), (showMessage.value = true));
  }
};

const onInputCPFPreCadastro = async () => {
  showAllInputs.value = false;

  if (dadosForm.value.cpf && dadosForm.value.cpf.length)
    dadosForm.value.cpf = dadosForm.value.cpf.replace(/\D/g, "");
  dadosForm.value.cpfCnpj = dadosForm.value.cpf;

  // valida cpf
  if (dadosForm.value.cpf && dadosForm.value.cpf.length == 11) {
    return validateCPF(dadosForm.value.cpf)
      ? await validarPreCadastro()
      : ((message.value = "Erro: CPF Inválido."), (showMessage.value = true));
  }
};

const carregarAlunoPreCadastro = async () => {
  const { data: alunoPreCadastro, error } = await useFetch(
    "/api/pre-cadastro/aluno",
    {
      query: {
        cpf: dadosForm.value.cpf,
      },
    },
  );

  if (
    error.value ||
    alunoPreCadastro.value?.statusCode ||
    alunoPreCadastro.value?.error
  ) {
    message.value =
      error.value ||
      alunoPreCadastro.value?.error ||
      alunoPreCadastro.value?.message;
    showMessage.value = true;
    return null;
  }

  if (Array.isArray(alunoPreCadastro.value)) {
    return alunoPreCadastro.value.length ? alunoPreCadastro.value[0] : null;
  }

  return alunoPreCadastro.value;
};

const validarPreCadastro = async () => {
  dadosForm.value = {
    ...createEmptyDadosForm(),
    cpf: dadosForm.value.cpf,
    cpfCnpj: dadosForm.value.cpf,
  };
  loading.value = true;

  const alunoPreCadastro = await carregarAlunoPreCadastro();

  loading.value = false;

  if (
    !alunoPreCadastro ||
    (typeof alunoPreCadastro === "object" &&
      !Array.isArray(alunoPreCadastro) &&
      !Object.keys(alunoPreCadastro).length)
  ) {
    message.value = "Aluno não encontrado para pré cadastro.";
    return (showMessage.value = true);
  }

  await preencherDadosFormulario(normalizePreCadastroData(alunoPreCadastro));

  showAllInputs.value = true;
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
    showMessage.value = true;
    return true;
  }

  return false;
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
  dadosForm.value = {
    ...createEmptyDadosForm(),
    cpf: dadosForm.value.cpf,
    cpfCnpj: dadosForm.value.cpf,
  };

  if (!etapaAtiva.value)
    return (
      (message.value = "Erro: Nenhuma etapa em andamento."),
      (showMessage.value = true)
    );

  loading.value = true;
  hasInscricaoAtiva.value = false;
  const aluno = await carregarAlunoMatriculaOnline(); // Verifica se o aluno existe no Matricula On-line

  if (aluno) {
    await preencherDadosFormulario(aluno);
    hasInscricaoAtiva.value = await possuiInscricaoEtapaAtiva(aluno); // Verifica se já possui inscricao na etapa ativa

    if (hasInscricaoAtiva.value) {
      loading.value = false;
      message.value =
        hasInscricaoAtiva.value.message ||
        "Erro: Aluno(a) já está inscrito nesta etapa do processo.";

      showMessage.value = true;
    }
  }

  if (hasInscricaoAtiva.value) {
    loading.value = false;
    return;
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
        ...createEmptyDadosForm(),
        ...dadosForm.value,
        cpf: alunoErudio.cpf,
        cpfCnpj: alunoErudio.cpf,
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
  const { valid } = await form.value.validate();
  if (!valid)
    return (
      (message.value = "Verifique os campos obrigatórios e tente novamente."),
      (showMessage.value = true)
    );

  if (!validateAddressPayload(dadosEndereco.value))
    return (
      (message.value = "Preencha os campos obrigatórios do endereço."),
      (showMessage.value = true)
    );

  if (dadosForm.value.email && !validateEmail(dadosForm.value.email))
    return (
      (message.value = "Erro: E-mail inválido."), (showMessage.value = true)
    );

  if (isCpfCnpjObrigatorio.value && !normalizeDigits(dadosForm.value.cpfCnpj))
    return (
      (message.value = "Informe o CPF/CNPJ do aluno(a)."),
      (showMessage.value = true)
    );

  if (
    isProtocoloCpfObrigatorio.value &&
    !normalizeOptionalValue(dadosForm.value.protocoloRequerimentoCpf)
  )
    return (
      (message.value = "Informe o protocolo de requerimento do CPF."),
      (showMessage.value = true)
    );

  loadingButton.value = true;

  await (dadosForm.value.id ? editarPessoa() : criarPessoa());
};

const editarPessoa = async () => {
  const enderecoId = await persistirEndereco();
  if (!enderecoId) return;

  const { data: pessoaEditada, error } = await useFetch("/api/pessoas", {
    method: "PUT",
    body: buildPessoaPayload(enderecoId),
  });

  if (error.value || pessoaEditada.value.statusCode) {
    message.value = error.value || pessoaEditada.value.message;
    loadingButton.value = false;
    return (showMessage.value = true);
  }

  alunoState.value = pessoaEditada.value; // Grava a pessoa editada no State

  salvarInscricao();
};

const criarPessoa = async () => {
  const enderecoId = await persistirEndereco();
  if (!enderecoId) return;

  const { data: pessoaCriada, error } = await useFetch("/api/pessoas", {
    method: "POST",
    body: buildPessoaPayload(enderecoId),
  });

  if (error.value || pessoaCriada.value.statusCode) {
    message.value = error.value || pessoaCriada.value.message;
    loadingButton.value = false;
    return (showMessage.value = true);
  }

  alunoState.value = pessoaCriada.value; // Grava a pessoa criada no State

  salvarInscricao();
};

const persistirEndereco = async () => {
  const dadosMapeados = {
    ...dadosEndereco.value,
    cep: dadosEndereco.value.cep ? dadosEndereco.value.cep.toString() : null,
    numero: dadosEndereco.value.numero
      ? dadosEndereco.value.numero.toString()
      : null,
  };

  const endpoint = dadosForm.value.enderecoId ? "PUT" : "POST";
  if (dadosForm.value.enderecoId) dadosMapeados.id = dadosForm.value.enderecoId;

  const { data: enderecoSalvo, error } = await useFetch("/api/enderecos", {
    method: endpoint,
    body: dadosMapeados,
  });

  if (
    error.value ||
    enderecoSalvo.value?.error ||
    enderecoSalvo.value?.statusCode
  ) {
    message.value =
      error.value || enderecoSalvo.value?.message || "Erro ao salvar endereço.";
    loadingButton.value = false;
    showMessage.value = true;
    return null;
  }

  dadosForm.value.enderecoId = enderecoSalvo.value.id;
  return enderecoSalvo.value.id;
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

  const categoriasDocumentos = {
    certidao_identidade: documentos.value.certidao_identidade,
    cpf_rg_responsavel1: documentos.value.cpf_rg_responsavel1,
    cpf_rg_responsavel2: documentos.value.cpf_rg_responsavel2,
    comprovante_residencia: documentos.value.comprovante_residencia,
    foto_estudante: documentos.value.foto_estudante,
    declaracao_vacinacao: documentos.value.declaracao_vacinacao,
    cartao_cns: documentos.value.cartao_cns,
    cartao_social: documentos.value.cartao_social,
    cartao_bpc: documentos.value.cartao_bpc,
    tutela_provisoria: documentos.value.tutela_provisoria,
    laudo_medico: documentos.value.laudo_medico,
  };

  let listaNomes = [];
  // Percorre todas as categorias dinamicamente
  Object.entries(categoriasDocumentos).forEach(([nomeCampo, arquivos]) => {
    const lista = normalizeFiles(arquivos);
    lista.forEach((arquivo) => {
      formData.append("files", arquivo);
      listaNomes.push(nomeCampo);
    });
  });

  formData.append("nomeDocumento", listaNomes);

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

async function preencherDadosFormulario(dados = {}) {
  const endereco = dados.endereco || null;
  const enderecoId = endereco?.id || dados.enderecoId || null;

  dadosForm.value = {
    ...createEmptyDadosForm(),
    ...dadosForm.value,
    id: dados.id || null,
    cpf: dados.cpf || dados.cpfCnpj || dadosForm.value.cpf || "",
    cpfCnpj: dados.cpfCnpj || dados.cpf || dadosForm.value.cpf || "",
    nome: dados.nome || "",
    dataNascimento: dados.dataNascimento || "",
    email: dados.email || "",
    genero: dados.genero || "",
    estadoCivilId: dados.estadoCivil?.id || dados.estadoCivilId || null,
    racaId: dados.raca?.id || dados.racaId || null,
    nacionalidade: dados.nacionalidade || "BRASILEIRO",
    paisOrigemId: dados.paisOrigem?.id || dados.paisOrigemId || null,
    naturalidadeId: dados.naturalidade?.id || dados.naturalidadeId || null,
    nomeMae: dados.nomeMae || "",
    cpfMae: dados.cpfMae || "",
    nomePai: dados.nomePai || "",
    cpfPai: dados.cpfPai || "",
    responsavelNome: dados.responsavelNome || "",
    cpfResponsavel: dados.cpfResponsavel || "",
    conselheiroNome: dados.conselheiroNome || "",
    nomeSocial: Boolean(dados.nomeSocial),
    registroCivil: dados.registroCivil || "",
    numeroRg: dados.numeroRg || "",
    dataExpedicaoRg: dados.dataExpedicaoRg || "",
    orgaoExpedidorRg: dados.orgaoExpedidorRg || "",
    pisPasep: dados.pisPasep || "",
    certidaoNascimento: dados.certidaoNascimento || "",
    dataExpedicaoCertidaoNascimento:
      dados.dataExpedicaoCertidaoNascimento || "",
    nis: dados.nis || "",
    protocoloRequerimentoCpf: dados.protocoloRequerimentoCpf || "",
    enderecoId,
    etapa: dados.etapa || dadosForm.value.etapa || null,
    unidadeEnsinoId: dados.unidadeEnsinoId || dadosForm.value.unidadeEnsinoId,
  };

  if (endereco?.logradouro || endereco?.bairro || endereco?.cep) {
    dadosEndereco.value = {
      ...createEmptyEndereco(),
      ...endereco,
    };
    return;
  }

  if (enderecoId) {
    await carregarEndereco(enderecoId);
    return;
  }

  dadosEndereco.value = createEmptyEndereco();
}

async function carregarEndereco(id) {
  const { data: endereco, error } = await useFetch(`/api/enderecos/${id}`);

  if (error.value || endereco.value?.error || endereco.value?.statusCode) {
    dadosEndereco.value = createEmptyEndereco();
    return;
  }

  dadosEndereco.value = {
    ...createEmptyEndereco(),
    ...endereco.value,
  };
}

function buildPessoaPayload(enderecoId) {
  const payload = {
    id: dadosForm.value.id || undefined,
    nome: normalizeOptionalValue(dadosForm.value.nome),
    dataNascimento: normalizeOptionalValue(dadosForm.value.dataNascimento),
    cpfCnpj: normalizeDigits(dadosForm.value.cpfCnpj),
    email: normalizeOptionalValue(dadosForm.value.email),
    genero: normalizeOptionalValue(dadosForm.value.genero),
    estadoCivil: buildReference(dadosForm.value.estadoCivilId),
    raca: buildReference(dadosForm.value.racaId),
    nacionalidade: normalizeOptionalValue(dadosForm.value.nacionalidade),
    paisOrigem: buildReference(dadosForm.value.paisOrigemId),
    naturalidade: buildReference(dadosForm.value.naturalidadeId),
    nomeMae: normalizeOptionalValue(dadosForm.value.nomeMae),
    cpfMae: normalizeDigits(dadosForm.value.cpfMae),
    nomePai: normalizeOptionalValue(dadosForm.value.nomePai),
    cpfPai: normalizeDigits(dadosForm.value.cpfPai),
    responsavelNome: normalizeOptionalValue(dadosForm.value.responsavelNome),
    cpfResponsavel: normalizeDigits(dadosForm.value.cpfResponsavel),
    conselheiroNome: normalizeOptionalValue(dadosForm.value.conselheiroNome),
    nomeSocial: Boolean(dadosForm.value.nomeSocial),
    registroCivil: normalizeOptionalValue(dadosForm.value.registroCivil),
    endereco: buildReference(enderecoId),
    numeroRg: normalizeOptionalValue(dadosForm.value.numeroRg),
    dataExpedicaoRg: normalizeOptionalValue(dadosForm.value.dataExpedicaoRg),
    orgaoExpedidorRg: normalizeOptionalValue(dadosForm.value.orgaoExpedidorRg),
    pisPasep: normalizeOptionalValue(dadosForm.value.pisPasep),
    certidaoNascimento: normalizeOptionalValue(
      dadosForm.value.certidaoNascimento,
    ),
    dataExpedicaoCertidaoNascimento: normalizeOptionalValue(
      dadosForm.value.dataExpedicaoCertidaoNascimento,
    ),
    nis: normalizeOptionalValue(dadosForm.value.nis),
    protocoloRequerimentoCpf: normalizeOptionalValue(
      dadosForm.value.protocoloRequerimentoCpf,
    ),
  };

  return payload;
}

function normalizePreCadastroData(data = {}) {
  const pessoa = data.payload?.pessoa || {};
  const aluno = data.aluno || {};
  const matricula = data.matricula || {};

  return {
    ...pessoa,
    id: pessoa.id || aluno.id || null,
    codigo: pessoa.codigo || aluno.codigo || null,
    cpf: aluno.cpf || pessoa.cpfCnpj || null,
    cpfCnpj: pessoa.cpfCnpj || aluno.cpf || null,
    nome: pessoa.nome || aluno.nome || null,
    dataNascimento: pessoa.dataNascimento || aluno.dataNascimento || null,
    responsavelNome:
      pessoa.responsavelNome || aluno.responsavelNome || null,
    endereco: pessoa.endereco || null,
    etapa:
      matricula.etapa?.id && matricula.etapa?.nome
        ? {
            id: matricula.etapa.id,
            nome: matricula.etapa.nome,
          }
        : null,
    unidadeEnsinoId:
      pessoa.matricula?.unidadeEnsino?.id || matricula.unidadeEnsino?.id || null,
  };
}

function buildReference(id) {
  return id ? { id } : null;
}

function normalizeOptionalValue(value) {
  if (value === undefined || value === null) return null;

  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized.length ? normalized : null;
  }

  return value;
}

function normalizeDigits(value) {
  const normalized = normalizeOptionalValue(value);
  if (typeof normalized !== "string") return normalized;

  const digits = normalized.replace(/\D/g, "");
  return digits.length ? digits : null;
}

function validateAddressPayload(endereco = {}) {
  return Boolean(endereco.bairro && endereco.logradouro && endereco.numero);
}

function createEmptyDadosForm() {
  return {
    id: null,
    cpf: "",
    cpfCnpj: "",
    nome: "",
    dataNascimento: "",
    email: "",
    genero: "",
    estadoCivilId: null,
    racaId: null,
    nacionalidade: "BRASILEIRO",
    paisOrigemId: null,
    naturalidadeId: null,
    nomeMae: "",
    cpfMae: "",
    nomePai: "",
    cpfPai: "",
    responsavelNome: "",
    cpfResponsavel: "",
    conselheiroNome: "",
    nomeSocial: false,
    registroCivil: "",
    numeroRg: "",
    dataExpedicaoRg: "",
    orgaoExpedidorRg: "",
    pisPasep: "",
    certidaoNascimento: "",
    dataExpedicaoCertidaoNascimento: "",
    nis: "",
    protocoloRequerimentoCpf: "",
    enderecoId: null,
    etapa: null,
    unidadeEnsinoId: null,
  };
}

function createEmptyEndereco() {
  return {
    cep: null,
    bairro: null,
    logradouro: null,
    numero: null,
    complemento: null,
  };
}
</script>

<style scoped>
.align-skeleton-loading :nth-child(1),
.align-skeleton-loading :nth-child(2) {
  margin-top: 12px;
}
</style>
