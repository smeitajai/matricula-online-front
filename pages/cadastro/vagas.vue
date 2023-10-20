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
      :quadro="quadroSelected"
      :unidade="unidadeSelected"
      @close="dialog = false"
      @confirm="onConfirm($event)"
    />
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
const { data: quadrosVaga } = await useFetch(
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
const message = ref("");
const dialog = ref(false);
const textFilter = ref(null);
const quadrosFiltrados = ref(null);
const etapaProcessoState = useEtapaProcesso();

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

  quadrosFiltrados.value = quadrosVaga.value;

  etapaProcessoState.value =
    processo.value && processo.value.processoEtapas
      ? processo.value.processoEtapas.find((etapa) => etapa.emAndamento)
      : null;
});

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

const onConfirm = async () => {
  const { data: inscricaoCriada, error } = await useFetch("/api/inscricoes", {
    method: "POST",
    body: {
      alunoId: alunoState.value.id,
      processoEtapaId: etapaProcessoState.value.id,
      quadroVagaId: quadroSelected.value.id,
    },
  });

  if (error.value || !inscricaoCriada.value.id) {
    message.value =
      inscricaoCriada.value && !inscricaoCriada.value.id
        ? inscricaoCriada.value.message
        : error.value.message;
    return (showMessage.value = true);
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
