<template>
  <v-row class="ma-5">
    <PageTitle
      :title="`Matrícula de ${pessoa.nome || ''} | ${etapa.nome || ''}`"
    >
      <template #subtitle>
        <span>Clique na unidade de ensino pretendida para escolher a vaga</span>
      </template>
    </PageTitle>

    <v-col v-if="unidades && quadrosVaga" cols="12">
      <CoreList
        :elevation="4"
        :items="quadrosVaga"
        :item-text="
          (i) => getNomeUnidade(i.unidadeEnsinoId) + ` - ${getTurno(i.turnoId)}`
        "
        :item-text-sub="(i) => getEnderecoUnidade(i.unidadeEnsinoId)"
        @click="onClickItem($event)"
      >
        <template #itemTextSubtitle>
          {{ endereco }}
        </template>
      </CoreList>
    </v-col>

    <CadastroDialogVagas
      v-if="dialog"
      :dialog="dialog"
      :etapa="etapa"
      :turno="turnoSelected"
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
const { data: turnos } = await useFetch("/api/turnos");
const { data: pessoa } = useFetch(`/api/alunos/${route.query.aluno}`);
const { data: etapa } = await useFetch(`/api/etapas/${route.query.etapa}`);
const { data: quadrosVaga } = await useFetch("/api/quadros-vaga", {
  query: {
    etapa: route.query.etapa,
  },
});

onMounted(() => {
  if (unidades.value && unidades.value.error) {
    message.value = unidades.value.message;
    return (showMessage.value = true);
  }

  if (etapa.value && etapa.value.error) {
    message.value = etapa.value.message;
    return (showMessage.value = true);
  }
});

const quadroSelected = ref(null);
const turnoSelected = ref(null);
const unidadeSelected = ref(null);
const showMessage = ref(false);
const message = ref("");
const dialog = ref(false);

const getNomeUnidade = (unidadeEnsinoId) => {
  const unidade = unidades.value.find((u) => u.id == unidadeEnsinoId);
  return unidade.nome;
};

const getEnderecoUnidade = (unidadeEnsinoId) => {
  // const unidade = unidades.value.find((u) => u.id == unidadeEnsinoId);
  // return unidade.endereco;
  return endereco;
};

const getTurno = (turnoId) => {
  const turno = turnos.value.find((t) => t.id == turnoId);
  return turno.nome;
};

const onClickItem = (quadro) => {
  quadroSelected.value = quadro;
  turnoSelected.value = turnos.value.find((t) => t.id == quadro.turnoId);
  unidadeSelected.value = unidades.value.find(
    (u) => u.id == quadro.unidadeEnsinoId,
  );
  dialog.value = true;
};

const onConfirm = async () => {
  const { data: inscricaoCriada, error } = await useFetch("/api/inscricoes", {
    method: "POST",
    body: {
      alunoId: pessoa.value.id,
      processoId: "6b0e883e-3833-40e7-85a9-e11d8a311548",
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
