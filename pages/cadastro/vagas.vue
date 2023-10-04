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

    <v-col v-if="unidades && quadrosVaga && etapaProcessoState" cols="12">
      <CoreList
        :elevation="4"
        :items="quadrosVaga"
        :item-text="(i) => getNomeUnidade(i.unidadeEnsinoId) + `: ${i.nome}`"
        :item-text-sub="(i) => getEnderecoUnidade(i.unidadeEnsinoId)"
        @click="onClickItem($event)"
      >
        <template #itemTextSubtitle>
          {{ endereco }}
        </template>
      </CoreList>
    </v-col>

    <v-alert
      v-else
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
const route = useRoute();
const { data: unidades } = await useFetch("/api/unidades");
const { data: quadrosVaga } = await useFetch("/api/quadros-vaga", {
  query: {
    etapa: route.query.etapa,
  },
});
const { data: processo } = await useFetch("/api/processos/em-andamento");
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

const quadroSelected = ref(null);
const unidadeSelected = ref(null);
const showMessage = ref(false);
const message = ref("");
const dialog = ref(false);

const getNomeUnidade = (unidadeEnsinoId) => {
  const unidade = unidades.value.find((u) => u.id == unidadeEnsinoId);
  return unidade.nome;
};

const getEnderecoUnidade = (unidadeEnsinoId) => {
  // Unidade de ensino ainda não tem relação com Endereço - REFATORAR!
  // const unidade = unidades.value.find((u) => u.id == unidadeEnsinoId);
  // return unidade.endereco;
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

const endereco = "Rua teste, n° 123 - Dom Bosco | Polo 1 ";
</script>
