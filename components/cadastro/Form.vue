<template>
  <v-form ref="form" class="pa-10">
    <CadastroPreCadastroAlunoForm
      :bairros-preferenciais="bairrosPreferenciais || []"
      :documentos="documentos"
      :endereco="dadosEndereco"
      :processo-etapas="processoEtapas"
      :etapa-options="etapasCurso"
      :form-data="dadosForm"
      :is-cpf-cnpj-obrigatorio="isCpfCnpjObrigatorio"
      :is-protocolo-cpf-obrigatorio="isProtocoloCpfObrigatorio"
      :loading-bairros="loadingBairros"
      :loading="loading"
      :nacionalidade-options="nacionalidadeOptions"
      :curso-options="Array.isArray(cursos) ? cursos : []"
      :turno-options="turnos || []"
      :unidade-options="unidadeOptions"
      @buscar-por-cpf="buscarAlunoPorCpfPreCadastro"
      @buscar-irmao-por-cpf="buscarIrmaoPorCpfPreCadastro"
      @cpf-invalido="onCpfInvalidoPreCadastro"
      @update:documentos="documentos = $event"
      @update:endereco="dadosEndereco = $event"
      @update:form-data="dadosForm = $event"
      @update:genero="dadosForm.genero = $event"
      @validate-address="validateAddress = $event"
      @submit="onSubmit()"
    />

    <v-row v-if="dadosForm.processoEtapa?.tipo === 'TRANSFERENCIA'">
      <v-row>
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
      <CoreFormSubtitle label="Responsável" />
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

      <CoreFormSubtitle label="Aluno(a)" />
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
          @update:model-value="documentos.declaracao_vacinacao = $event"
        />

        <CoreFileInput
          v-model="documentos.cartao_cns"
          chips
          clearable
          label="Cartão Nacional de Saúde (CNS)"
          @update:model-value="documentos.cartao_cns = $event"
        />

        <CoreFileInput
          v-model="documentos.cartao_social"
          chips
          clearable
          label="Cartão Social (NIS)"
          @update:model-value="documentos.cartao_social = $event"
        />

        <CoreFileInput
          v-model="documentos.cartao_bpc"
          chips
          clearable
          label="Cartão Benefício de Prestação Continuada (BPC)"
          @update:model-value="documentos.cartao_bpc = $event"
        />

        <CoreFileInput
          v-model="documentos.tutela_provisoria"
          chips
          clearable
          label="Tutela provisória"
          @update:model-value="documentos.tutela_provisoria = $event"
        />

        <CoreFileInput
          v-model="documentos.laudo_medico"
          chips
          clearable
          label="Laudo Médico"
          @update:model-value="documentos.laudo_medico = $event"
        />
      </template>
    </v-row>

    <v-row v-if="dadosForm.processoEtapa?.tipo !== 'MATRICULA'" justify="end">
      <!-- <CoreButton
        label="salvar"
        prepend-icon="mdi-content-save"
        :loading="loadingButton"
        @click="onSubmit()"
      /> -->
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
const route = useRoute();
const router = useRouter();
const showAllInputs = ref(false);
const showDialogProcessoExterno = ref(false);
const showDialogProcessoInterno = ref(false);
const showMessage = ref(false);
const message = ref("");
const opcaoProcessoSelecionada = ref(null);
const etapaAtiva = ref(null);
const etapaAtivaAtual = ref(null);
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
const CURSO_PRE_CADASTRO_ID = 10;

const { data: etapas } = await useFetch("/api/etapas");
const { data: etapasCurso, refresh: carregarEtapasCurso } = await useLazyFetch(
  "/api/etapas",
  {
    query: computed(() => {
      const curso = dadosForm.value.cursoId || CURSO_PRE_CADASTRO_ID;
      return curso ? { curso } : {};
    }),
    default: () => [],
    immediate: false,
    server: false,
    watch: false,
  },
);

const { data: processos } = await useFetch("/api/processos");
const { data: cursos, refresh: carregarCursos } = await useLazyFetch(
  "/api/cursos",
  {
    default: () => [],
    immediate: false,
    server: false,
  },
);
const { data: turnos } = await useFetch("/api/turnos");
const { data: unidades, refresh: carregarUnidades } = await useLazyFetch(
  "/api/pre-cadastro/unidades",
  {
    query: computed(() => {
      const bairro = getBairroPreferencialId();
      const etapaOfertada = Number(
        dadosForm.value.etapa?.idExterno || dadosForm.value.etapa?.id,
      );

      if (!bairro) return {};

      return etapaOfertada
        ? { bairro, "etapa-ofertada": etapaOfertada }
        : { bairro };
    }),
    default: () => [],
    immediate: false,
    server: false,
    watch: false,
  },
);

const unidadeOptions = computed(() =>
  Array.isArray(unidades.value)
    ? unidades.value.map((unidade) => ({
        ...unidade,
        idExterno: String(unidade?.idExterno ?? unidade?.id ?? ""),
      }))
    : [],
);
const {
  data: bairrosPreferenciais,
  pending: loadingBairros,
  refresh: carregarBairrosPreferenciais,
} = await useLazyFetch("/api/pre-cadastro/bairros", {
  default: () => [],
  immediate: false,
  server: false,
});

const emit = defineEmits(["submit"]);

//const ANO_INSCRICAO = new Date().getFullYear() + 1;

const OPCAO_PRE_CADASTRO_ID = "pre-cadastro";

const nacionalidadeOptions = [
  { label: "Brasileiro", value: "BRASILEIRO" },
  { label: "Estrangeiro Naturalizado", value: "ESTRANGEIRO_NATURALIZADO" },
  { label: "Estrangeiro", value: "ESTRANGEIRO" },
];

const { data: processoEtapas, error: errorProcessoEtapas } = await useFetch(
  `/api/processo-etapas?processoId=${route.query.tipo}`,
);

onMounted(() => {
  const tipo = Number(route.query.tipo);

  etapaAtivaAtual.value =
    processos.value
      ?.flatMap((p) => p.processoEtapas)
      .find((etapa) => etapa.id === tipo) || null;

  carregarCursos();
  carregarBairrosPreferenciais();

  if (!etapaAtivaAtual.value) {
    message.value = "Erro: Nenhuma etapa em andamento.";
    return (showMessage.value = true);
  }

  syncOpcaoProcessoPorTipo();
});

const isEtapaAtivaSelecionada = computed(
  () =>
    !!opcaoProcessoSelecionada.value &&
    opcaoProcessoSelecionada.value.id !== OPCAO_PRE_CADASTRO_ID,
);

const isCpfCnpjObrigatorio = computed(
  () => dadosForm.value.nacionalidade !== "ESTRANGEIRO",
);

const isProtocoloCpfObrigatorio = computed(
  () => dadosForm.value.nacionalidade === "ESTRANGEIRO",
);

const isTransferenciaInferida = computed(
  () => dadosForm.value.tipoInscricaoInferido === "TRANSFERENCIA",
);

const bairroPreferencialSelecionadoId = computed(() =>
  getBairroPreferencialId(),
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
const onChangeOpcaoProcesso = async (opcao) => {
  opcaoProcessoSelecionada.value = opcao;
  limparEstadoFormulario();

  etapaAtiva.value =
    opcao && opcao.id !== OPCAO_PRE_CADASTRO_ID ? etapaAtivaAtual.value : null;

  if (opcao?.id === OPCAO_PRE_CADASTRO_ID) {
    dadosForm.value.etapa = etapaAtivaAtual.value || null;
    if (!bairrosPreferenciais.value?.length) {
      await carregarBairrosPreferenciais();
    }
    showAllInputs.value = true;
  }
};

const syncOpcaoProcessoPorTipo = async () => {
  if (!etapaAtivaAtual.value) return;

  const tipoSelecionado = route.query.tipo;
  const opcao =
    tipoSelecionado === OPCAO_PRE_CADASTRO_ID
      ? { id: OPCAO_PRE_CADASTRO_ID, nome: "Pré cadastro" }
      : etapaAtivaAtual.value;

  await onChangeOpcaoProcesso(opcao);
};

watch(
  () => route.query.tipo,
  async () => {
    await syncOpcaoProcessoPorTipo();
  },
);

watch(
  () => dadosForm.value.cursoId,
  async (cursoIdAtual, cursoIdAnterior) => {
    if (!cursoIdAtual) {
      etapasCurso.value = [];
      dadosForm.value.etapa = null;
      return;
    }

    await carregarEtapasCurso();

    const etapaSelecionadaAindaExiste = Array.isArray(etapasCurso.value)
      ? etapasCurso.value.some(
          (etapa) => String(etapa?.id) === String(dadosForm.value.etapa?.id),
        )
      : false;

    if (cursoIdAtual !== cursoIdAnterior || !etapaSelecionadaAindaExiste) {
      dadosForm.value.etapa = etapaSelecionadaAindaExiste
        ? dadosForm.value.etapa
        : null;
    }
  },
  {
    immediate: true,
  },
);

watch(
  bairroPreferencialSelecionadoId,
  async (bairroIdAtual, bairroIdAnterior) => {
    if (!bairroIdAtual) {
      unidades.value = [];
      dadosForm.value.unidadeEnsinoId = null;
      return;
    }

    await carregarUnidades();

    const unidadeSelecionadaAindaExiste = Array.isArray(unidadeOptions.value)
      ? unidadeOptions.value.some(
          (unidade) =>
            String(unidade?.idExterno) ===
            String(dadosForm.value.unidadeEnsinoId),
        )
      : false;

    if (bairroIdAtual !== bairroIdAnterior || !unidadeSelecionadaAindaExiste) {
      dadosForm.value.unidadeEnsinoId = unidadeSelecionadaAindaExiste
        ? dadosForm.value.unidadeEnsinoId
        : null;
    }
  },
);

const onInputCPFPorTipo = async () => {
  if (isEtapaAtivaSelecionada.value) {
    return onInputCPFEtapaAtiva();
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

const carregarAlunoPreCadastro = async (cpf) => {
  const { data: alunoPreCadastro, error } = await useFetch(
    "/api/pre-cadastro/aluno",
    {
      query: {
        cpf,
      },
    },
  );

  if (Array.isArray(alunoPreCadastro.value)) {
    return alunoPreCadastro.value.length ? alunoPreCadastro.value[0] : null;
  }

  if(alunoPreCadastro.value?.endereco?.bairro?.id) {
    alunoPreCadastro.value.endereco.bairro = alunoPreCadastro.value.endereco.bairro.nome 
  }

  return alunoPreCadastro.value;
};

const validarPreCadastro = async (cpf = dadosForm.value.cpf) => {
  const processoEtapa = dadosForm.value.processoEtapa || null;
  const dadosIrmao = {
    possuiIrmaoMatriculado: Boolean(dadosForm.value.possuiIrmaoMatriculado),
    cpfIrmao: dadosForm.value.cpfIrmao || "",
    nomeIrmao: dadosForm.value.nomeIrmao || "",
    cpfIrmaoError: dadosForm.value.cpfIrmaoError || "",
  };

  dadosForm.value = {
    ...createEmptyDadosForm(),
    ...dadosIrmao,
    processoEtapa,
    cpf,
    cpfCnpj: cpf,
  };
  loading.value = true;

  const [alunoPreCadastro, alunoMatriculaOnline] = await Promise.all([
    carregarAlunoPreCadastro(cpf),
    carregarAlunoMatriculaOnline(cpf),
  ]);

  if(alunoPreCadastro?.id) {
    dadosForm.value.erudioPessoaId = alunoPreCadastro.id
  }

  loading.value = false;

  if (
    !alunoPreCadastro ||
    (typeof alunoPreCadastro === "object" &&
      !Array.isArray(alunoPreCadastro) &&
      !Object.keys(alunoPreCadastro).length)
  ) {
    dadosForm.value = {
      ...dadosForm.value,
      ...(alunoMatriculaOnline?.id ? { id: alunoMatriculaOnline.id } : {}),
      tipoInscricaoInferido: "CADASTRO",
    };
    showAllInputs.value = true;
    return;
  }

  await preencherDadosFormulario(alunoPreCadastro);
  if (alunoMatriculaOnline?.id) {
    dadosForm.value.id = alunoMatriculaOnline.id;
  }
  dadosForm.value.tipoInscricaoInferido = "CADASTRO";

  showAllInputs.value = true;
};

const buscarAlunoPorCpfPreCadastro = async (cpf) => {
  await validarPreCadastro(cpf);
};

const onCpfInvalidoPreCadastro = () => {
  message.value = "Erro: CPF Inválido.";
  showMessage.value = true;
};

const buscarIrmaoPorCpfPreCadastro = async (cpf) => {
  const cpfNormalizado = normalizeDigits(cpf);

  if (!cpfNormalizado || cpfNormalizado.length !== 11) {
    return;
  }

  const ordem = etapaAtivaAtual.value?.ordem || etapaAtiva.value?.ordem;

  if (!ordem) {
    dadosForm.value = {
      ...dadosForm.value,
      nomeIrmao: "",
      cpfIrmaoError: "Não foi possível validar o irmão no momento.",
    };
    return;
  }

  const data = await carregarAlunoPreCadastro(cpfNormalizado);

  if (!data || data?.statusCode || data?.error || !data?.cpf) {
    dadosForm.value = {
      ...dadosForm.value,
      nomeIrmao: "",
      cpfIrmaoError:
        data?.message || "Irmão não encontrado na rede municipal.",
    };
    return;
  }

  dadosForm.value = {
    ...dadosForm.value,
    cpfIrmao: cpfNormalizado,
    nomeIrmao: data?.nome || "",
    cpfIrmaoError: "",
  };
};

const carregarAlunoMatriculaOnline = async (cpf = dadosForm.value.cpf) => {
  const { data, error } = await useFetch("/api/alunos", {
    query: {
      cpf,
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
  if (!validateAddressPayload(dadosEndereco.value))
    return (
      (message.value = "Preencha os campos obrigatórios do endereço."),
      (showMessage.value = true)
    );

  if (!normalizeOptionalValue(dadosForm.value.emailResponsavel))
    return (
      (message.value = "Informe o e-mail do(a) responsável."),
      (showMessage.value = true)
    );

  if (dadosForm.value.email && !validateEmail(dadosForm.value.emailResponsavel))
    return (
      (message.value = "Erro: E-mail inválido."), (showMessage.value = true)
    );

  if (!normalizeOptionalValue(dadosForm.value.telefone1))
    return (
      (message.value = "Informe o telefone do(a) responsável."),
      (showMessage.value = true)
    );

  if (!normalizeDigits(dadosForm.value.cpfResponsavel))
    return (
      (message.value = "Informe o CPF do(a) responsável."),
      (showMessage.value = true)
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

  if (
    dadosForm.value.possuiIrmaoMatriculado &&
    (!normalizeDigits(dadosForm.value.cpfIrmao) || !dadosForm.value.nomeIrmao)
  )
    return (
      (message.value =
        "Informe um CPF de irmão válido e aguarde a localização na rede municipal."),
      (showMessage.value = true)
    );

  if (dadosForm.value.possuiIrmaoMatriculado && dadosForm.value.cpfIrmaoError)
    return (
      (message.value = dadosForm.value.cpfIrmaoError),
      (showMessage.value = true)
    );

  if (!validatePreCadastroDocuments())
    return (
      (message.value =
        "Anexe todos os documentos obrigatórios do pré-cadastro."),
      (showMessage.value = true)
    );

  if (isTransferenciaInferida.value && !validateTurnoTransferencia())
    return (
      (message.value =
        "O turno preferencial deve ser diferente do turno atual para transferência."),
      (showMessage.value = true)
    );

  loadingButton.value = true;

  await (dadosForm.value.id ? editarPessoa() : criarPessoa());
};

const editarPessoa = async () => {
  const enderecoId = dadosForm.value.enderecoId ;
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

  const inscricaoCriada = await salvarInscricao();
  if (!inscricaoCriada) return;
  
  const sincronizacaoConcluida = await sincronizarAlunoErudio(inscricaoCriada);
  if (!sincronizacaoConcluida) return;

  await salvarDocumentos(inscricaoCriada);
};

const criarPessoa = async () => {
  const payload = buildAlunoPayload();
  if (!payload) return;

  const { data: pessoaCriada, error } = await useFetch("/api/pessoas", {
    method: "POST",
    body: payload,
  });

  if (
    error.value ||
    pessoaCriada.value?.error ||
    pessoaCriada.value?.statusCode
  ) {
    message.value =
      error.value || pessoaCriada.value?.message || "Erro ao salvar pessoa.";
    loadingButton.value = false;
    showMessage.value = true;
    return;
  }

  if (!pessoaCriada.value?.id) {
    message.value = "Pessoa criada sem retorno válido da API.";
    loadingButton.value = false;
    showMessage.value = true;
    return;
  }

  alunoState.value = pessoaCriada.value;

  const inscricaoCriada = await salvarInscricao();
  if (!inscricaoCriada) return;

  const sincronizacaoConcluida = await sincronizarAlunoErudio(inscricaoCriada);
  if (!sincronizacaoConcluida) return;

  await salvarDocumentos(inscricaoCriada);
};

const salvarInscricao = async () => {
  const { data: inscricaoCriada, error } = await useFetch("/api/inscricoes", {
    server: false,
    method: "POST",
    body: {
      alunoId: alunoState.value.id.toString(),
      processoEtapaId: etapaAtiva.value.id,
      unidadeEnsinoProximoAnoId:
        dadosForm.value.unidadeEnsinoId ||
        "",
      etapaProximoAnoId:
        String(dadosForm.value.etapa.id),
      turnoProximoAnoId:
        String(dadosForm.value.turnoPreferencialId),
      bairroIdExterno: String(getBairroPreferencialId())
    },
  });

  if (error.value || inscricaoCriada.value.statusCode) {
    message.value = error.value || inscricaoCriada.value.message;
    loadingButton.value = false;
    showMessage.value = true
    return false
  }

  return inscricaoCriada.value;
};

const sincronizarAlunoErudio = async (inscricao) => {
  const payload = buildSincronizacaoErudioPayload(inscricao);
  if (!payload) return false;

  const { data: sincronizacao, error } = await useFetch(
    "/api/erudio/alunos/sincronizar",
    {
      method: "POST",
      body: payload,
    },
  );

  if (
    error.value ||
    sincronizacao.value?.statusCode ||
    sincronizacao.value?.error
  ) {
    message.value =
      error.value ||
      sincronizacao.value?.message ||
      "Erro ao sincronizar aluno no Erudio.";
    loadingButton.value = false;
    showMessage.value = true;
    return false;
  }

  return true;
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
    cpf_rg_responsavel: documentos.value.cpf_rg_responsavel,
    cpf_rg_responsavel1: documentos.value.cpf_rg_responsavel1,
    cpf_rg_responsavel2: documentos.value.cpf_rg_responsavel2,
    comprovante_residencia: documentos.value.comprovante_residencia,
    declaracao_proprietario_residencia:
      documentos.value.declaracao_proprietario_residencia,
    foto_estudante: documentos.value.foto_estudante,
    declaracao_vacinacao: documentos.value.declaracao_vacinacao,
    cartao_cns: documentos.value.cartao_cns,
    cartao_social: documentos.value.cartao_social,
    cartao_bpc: documentos.value.cartao_bpc,
    tutela_provisoria: documentos.value.tutela_provisoria,
    laudo_medico: documentos.value.laudo_medico,
    anexo_cras: documentos.value.anexo_cras,
    comprovante_de_escolaridade: documentos.value.comprovante_de_escolaridade,
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

  await gerarprotocolo(inscricao);
};

const gerarprotocolo = async (inscricao) => {
  const query = {
    inscricao: inscricao.id || inscricao.inscricao || "",
    protocolo: inscricao.protocolo || "",
  };

  try {
    return await router.push({
      path: "/cadastro/solicitacao-efetivada",
      query,
    });
  } catch (_) {
    if (import.meta.client) {
      const search = new URLSearchParams(query).toString();
      window.location.href = `/cadastro/solicitacao-efetivada?${search}`;
    }
  }
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
    telefone1: dados.telefone1 || "",
    telefone2: dados.telefone2 || "",
    falarComTelefoneResponsavel: dados.falarComTelefoneResponsavel || "",
    falarComTelefone2: dados.falarComTelefone2 || "",
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
    grauParentesco: dados.grauParentesco || "",
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
    cursoId: dados.cursoId || dadosForm.value.cursoId || CURSO_PRE_CADASTRO_ID,
    turnoPreferencialId:
      dados.turnoPreferencialId || dadosForm.value.turnoPreferencialId || null,
    enderecoId,
    etapa: dados.etapa || dadosForm.value.etapa || null,
    unidadeEnsinoId: dados.unidadeEnsinoId || dadosForm.value.unidadeEnsinoId,
    possuiIrmaoMatriculado: Boolean(
      dados.possuiIrmaoMatriculado || dadosForm.value.possuiIrmaoMatriculado,
    ),
    cpfIrmao: dados.cpfIrmao || dadosForm.value.cpfIrmao || "",
    nomeIrmao: dados.nomeIrmao || dadosForm.value.nomeIrmao || "",
    cpfIrmaoError: dadosForm.value.cpfIrmaoError || "",
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
    telefone1: normalizeOptionalValue(dadosForm.value.telefone1),
    telefone2: normalizeOptionalValue(dadosForm.value.telefone2),
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
    grauParentesco: normalizeOptionalValue(dadosForm.value.grauParentesco),
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
    naoFrequentando: dadosForm.value.naoFrequentando,
  };

  return payload;
}

function buildAlunoPayload() {
  let payload = {
    nome: normalizeOptionalValue(dadosForm.value.nome),
    cpf: normalizeDigits(dadosForm.value.cpf),
    email: dadosForm.value.email,
    dataNascimento: dadosForm.value.dataNascimento,
    telefone1: String(dadosForm.value.telefone1),
    telefone2: String(dadosForm.value.telefone2),
    responsavelNome: dadosForm.value.responsavelNome,
    naoFrequentando: dadosForm.value.naoFrequentando,
  };
  return payload;
}

function buildSincronizacaoErudioPayload(inscricao) {
  const etapaId = Number(
    dadosForm.value.etapa?.idExterno || dadosForm.value.etapa?.id,
  );
  const unidadeEnsinoId = Number(dadosForm.value.unidadeEnsinoId);
  const turnoId = Number(dadosForm.value.turnoPreferencialId);
  const bairroPreferencialId = getBairroPreferencialId();

  return {
    pessoa: buildErudioPessoaPayload(),
    rematricula: {
      protocolo: inscricao.protocolo,
      tipo:
        dadosForm.value.tipoInscricaoInferido === "TRANSFERENCIA"
          ? "TRANSFERENCIA"
          : "MATRICULA",
      bairroPreferencialId,
      bairroPretendido: bairroPreferencialId,
      unidadeEnsinoId,
      etapaId,
      turnoId,
      cpfIrmao: dadosForm.value.possuiIrmaoMatriculado
        ? normalizeDigits(dadosForm.value.cpfIrmao)
        : null,
      emailResponsavel: normalizeOptionalValue(
        dadosForm.value.emailResponsavel || dadosForm.value.email,
      ),
      telefoneResponsavel: normalizeOptionalValue(
        dadosForm.value.telefone1,
      ),
      inscricaoId: normalizeOptionalValue(inscricao.id),
      naoFrequentando: dadosForm.value.naoFrequentando,
      abrigo: dadosForm.value.criancaAbrigo
    },
  };
}

function getBairroPreferencialId() {
  const bairroPreferencial = normalizeOptionalValue(
    dadosForm.value.bairroPreferencial,
  );

  if (!bairroPreferencial || !Array.isArray(bairrosPreferenciais.value)) {
    return null;
  }

  const bairroSelecionado = bairrosPreferenciais.value.find(
    (bairro) => bairro?.nome === bairroPreferencial,
  );

  return Number(bairroSelecionado?.id) || null;
}

function buildErudioPessoaPayload() {
  return {
    id: dadosForm.value.erudioPessoaId || null,
    nome: normalizeOptionalValue(dadosForm.value.nome),
    cpfCnpj: normalizeDigits(dadosForm.value.cpfCnpj || dadosForm.value.cpf),
    dataNascimento: normalizeOptionalValue(dadosForm.value.dataNascimento),
    email: normalizeOptionalValue(
      dadosForm.value.emailResponsavel || dadosForm.value.email,
    ),
    telefone1: normalizeOptionalValue(
      dadosForm.value.telefone1,
    ),
    naoFrequentando: dadosForm.value.naoFrequentando,
    telefone2: normalizeOptionalValue(dadosForm.value.telefone2),
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
    grauParentesco: normalizeOptionalValue(dadosForm.value.grauParentesco),
    nomeSocial: Boolean(dadosForm.value.nomeSocial),
    registroCivil: normalizeOptionalValue(dadosForm.value.registroCivil),
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
    endereco: {
      cep: normalizeOptionalValue(dadosEndereco.value.cep),
      bairro: normalizeOptionalValue(dadosEndereco.value.bairro),
      logradouro: normalizeOptionalValue(dadosEndereco.value.logradouro),
      numero: normalizeOptionalValue(dadosEndereco.value.numero),
      complemento: normalizeOptionalValue(dadosEndereco.value.complemento),
    },
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
  return Boolean(
    endereco.cep && endereco.bairro && endereco.logradouro,
  );
}

function validatePreCadastroDocuments() {
  const obrigatorios = [
    "certidao_identidade",
    "cpf_rg_responsavel",
    "cartao_cns",
    "comprovante_residencia",
    "foto_estudante",
    "comprovante_de_escolaridade"
  ];

  if (dadosForm.value.criancaAbrigo) {
    obrigatorios.push("anexo_cras");
  }

  return obrigatorios.every(
    (campo) => normalizeFiles(documentos.value[campo]).length,
  );
}

function validateTurnoTransferencia() {
  return (
    !dadosForm.value.turnoAtualId ||
    String(dadosForm.value.turnoAtualId) !==
      String(dadosForm.value.turnoPreferencialId)
  );
}

function createEmptyDadosForm() {
  return {
    id: null,
    cpf: "",
    cpfCnpj: "",
    nome: "",
    dataNascimento: "",
    email: "",
    emailResponsavel: "",
    telefone1: "",
    telefoneResponsavel: "",
    telefone2: "",
    falarComTelefoneResponsavel: "",
    falarComTelefone2: "",
    genero: undefined,
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
    grauParentesco: "",
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
    cursoId: CURSO_PRE_CADASTRO_ID,
    bairroPreferencial: "",
    turnoPreferencialId: null,
    turnoAtualId: null,
    turnoAtualNome: "",
    criancaAbrigo: false,
    possuiIrmaoMatriculado: false,
    cpfIrmao: "",
    nomeIrmao: "",
    cpfIrmaoError: "",
    processoJudicial: "",
    tipoInscricaoInferido: "CADASTRO",
    enderecoId: null,
    etapa: null,
    unidadeEnsinoId: null,
    naoFrequentando: false
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
