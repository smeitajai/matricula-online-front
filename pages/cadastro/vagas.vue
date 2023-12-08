<template>
  <v-row class="ma-5">
    <PageTitle :title="`Matrícula de ${alunoState ? alunoState.nome : ''}`">
      <template v-if="etapaProcessoState" #subtitle>
        <v-col cols="12" class="pa-0">
          <span>Etapa atual do Processo: {{ etapaProcessoState.nome }}</span>
        </v-col>
        <v-col cols="12" class="px-0">
          <span
            >Clique na unidade de ensino pretendida para escolher a vaga
          </span>
        </v-col>
      </template>
    </PageTitle>

    <v-alert
      v-if="!quadrosFiltrados"
      type="info"
      title="Carregando..."
    ></v-alert>

    <v-col v-if="unidades && quadrosFiltrados && etapaProcessoState" cols="12">
      <CoreInput
        v-model="textFilter"
        clearable
        full-width
        label="Buscar por unidade de ensino"
        placeholder="Ex: Aníbal César"
        @input="(textFilter = $event), onInputFilter()"
      />
      <CoreList
        v-if="quadrosFiltrados.length"
        :elevation="4"
        :items="quadrosFiltrados"
        :item-text="(i) => getNomeUnidade(i.unidadeEnsinoId) + `: ${i.nome}`"
        :item-text-sub="(i) => getEnderecoUnidade(i.unidadeEnsinoId)"
        :lines="mobile ? 'two' : 'one'"
        @click="onClickItem($event)"
      >
        <template #itemTextSubtitle>
          {{ endereco }}
        </template>
      </CoreList>
      <v-alert v-else type="warning" title="Nenhuma vaga encontrada."></v-alert>
    </v-col>

    <v-alert
      v-if="!etapaProcessoState"
      type="error"
      title="Nenhuma etapa do processo está em andamento."
    ></v-alert>

    <CadastroDialogVagas
      v-if="dialog"
      :dialog="dialog"
      :aluno="alunoState"
      :quadro="quadroSelected"
      :unidade="unidadeSelected"
      @close="dialog = false"
      @confirm="onConfirm($event)"
    />

    <CoreDialog
      v-if="showCounter"
      v-model="showCounter"
      persistent
      title="Opsss...vaga ocupada!"
      toolbar
      :width="400"
    >
      <v-col cols="12" class="text-center">
        <p>Desculpe, mas a vaga que você selecionou já foi preenchida.</p>
        <br />
        <p>Atualizando as vagas em...</p>
      </v-col>
      <v-col cols="12" class="text-center">
        <v-progress-circular
          :rotate="360"
          :size="100"
          :width="8"
          :model-value="tempoEspera"
          indeterminate
          color="primary"
        >
          <template #default> {{ tempoEspera }} seg. </template>
        </v-progress-circular>
      </v-col>
    </CoreDialog>
  </v-row>

  <CoreSnackbar
    v-model="showMessage"
    color="error"
    :message="message"
    @hide="showMessage = $event"
  />
</template>

<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();
const route = useRoute();

const { data: unidades } = await useFetch("/api/unidades");
const { data: enderecos } = await useFetch("/api/enderecos");
const { data: polos } = await useFetch("/api/polos");
const { data: processo } = await useFetch("/api/processos/em-andamento");
const { data: quadrosVaga, refresh: refreshVagas } = await useFetch(
  "/api/quadros-vaga/vagas-disponiveis",
  {
    query: {
      etapa: route.query.etapa,
    },
  },
);

const quadroSelected = ref(null);
const unidadeSelected = ref(null);
const showMessage = ref(false);
const showCounter = ref(false);
const message = ref("");
const dialog = ref(false);
const textFilter = ref(null);
const quadrosFiltrados = ref(null);
const etapaProcessoState = useEtapaProcesso();
const tempoEspera = ref(11);

onMounted(() => {
  if (unidades.value && unidades.value.error) {
    message.value = unidades.value.message;
    return (showMessage.value = true);
  }

  if (quadrosVaga.value && quadrosVaga.value.error) {
    message.value = quadrosVaga.value.message;
    return (showMessage.value = true);
  }

  if (processo.value && processo.value.error) {
    message.value = processo.value.message;
    return (showMessage.value = true);
  }

  etapaProcessoState.value =
    processo.value && processo.value.processoEtapas
      ? processo.value.processoEtapas.find((etapa) => etapa.emAndamento)
      : null;

  ordenarQuadrosVaga();
});

const ordenarQuadrosVaga = () => {
  // Se não vier uma unidade como queryParams, mostra todas as unidades sem ordenação
  if (!route.query.unidade) return (quadrosFiltrados.value = quadrosVaga.value);

  // Ordena os quadros de vaga pelo Polo da unidade de Origem
  const unidade = unidades.value.find((u) => u.id == route.query.unidade);

  if (unidade) {
    quadrosVaga.value = quadrosVaga.value.sort((a, b) => {
      let unidadeA = unidades.value.find((u) => u.id == a.unidadeEnsinoId);
      let unidadeB = unidades.value.find((u) => u.id == b.unidadeEnsinoId);

      if (
        unidadeA.poloId === unidade.poloId &&
        unidadeB.poloId !== unidade.poloId
      ) {
        return -1; // 'a' vem antes de 'b'
      } else if (
        unidadeA.poloId !== unidade.poloId &&
        unidadeB.poloId === unidade.poloId
      ) {
        return 1; // 'b' vem antes de 'a'
      } else {
        return 0; // não muda a ordem
      }
    });
  }

  quadrosFiltrados.value = quadrosVaga.value;
};

const alunoState = useAluno();
if (!alunoState || !alunoState.value.id) {
  //Se não existir aluno no state, carrega o aluno
  const { data } = await useFetch(`/api/alunos/${route.query.aluno}`);
  alunoState.value = data.value;
}

const onInputFilter = () => {
  if (!textFilter.value) {
    quadrosFiltrados.value = quadrosVaga.value;
    return;
  }

  quadrosFiltrados.value = quadrosVaga.value.filter((quadro) => {
    const unidade = unidades.value.find((u) => u.id == quadro.unidadeEnsinoId);
    return new RegExp(textFilter.value.toUpperCase()).test(
      unidade.nome.toUpperCase(),
    );
  });
};

const getNomeUnidade = (unidadeEnsinoId) => {
  const { nome } = unidades.value.find((u) => u.id == unidadeEnsinoId);
  return nome;
};

const getEnderecoUnidade = (unidadeEnsinoId) => {
  const unidade = unidades.value.find((u) => u.id == unidadeEnsinoId);
  const { logradouro, numero, bairro } = enderecos.value.find(
    (e) => e.id == unidade.enderecoId,
  );
  const polo = polos.value.find((p) => p.id == unidade.poloId);
  const endereco = `${logradouro}, n° ${numero} - ${bairro} | Polo: ${polo.nome}`;
  return endereco;
};

const onClickItem = (quadro) => {
  quadroSelected.value = quadro;
  unidadeSelected.value = unidades.value.find(
    (u) => u.id == quadro.unidadeEnsinoId,
  );
  dialog.value = true;
};

// Função utilizada para aguardar um determinado tempo antes de atualizar a lista de vagas
const contagemRegressiva = () => {
  tempoEspera.value--;
  if (tempoEspera.value > 0) {
    setTimeout(contagemRegressiva, 1000); // Aguarde 1 segundo antes de chamar a função novamente
  } else {
    // Quando tempoEspera for igual a 0, fecha o dialog e reseta o contador
    showCounter.value = false;
    tempoEspera.value = 11;
  }
};

const onConfirm = async () => {
  const rota =
    etapaProcessoState.value.tipo == "MATRICULA"
      ? "inscricoes"
      : "inscricoes/transferencias";
  const { data: inscricaoCriada, error } = await useFetch(`/api/${rota}`, {
    method: "POST",
    body: {
      alunoId: alunoState.value.id,
      processoEtapaId: etapaProcessoState.value.id,
      quadroVagaId: quadroSelected.value.id,
    },
  });

  if (error.value || !inscricaoCriada.value.id) {
    // Quando da erro ou a vaga não esta mais disponível
    message.value = inscricaoCriada.value.message || "Erro: Vaga indisponível";
    showMessage.value = true;
    dialog.value = false;
    showCounter.value = true;
    refreshVagas(); // Atualiza a lista de vagas
    return contagemRegressiva(); // Executa a contagem regressiva enquanto atualiza a lista de vagas
  }

  dialog.value = false;
  await navigateTo({
    path: "/protocolo",
    query: {
      inscricao: inscricaoCriada.value.id,
    },
  });
};
</script>
