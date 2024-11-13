<template>
  <v-row class="ma-5">
    <PageTitle title="Consulta de Protocolo" />
    <v-col cols="12">
      <CoreInput
        v-model="cpf"
        :counter="11"
        clearable
        full-width
        hint="Digite apenas números"
        label="CPF do aluno(a)*"
        persistent-hint
        placeholder="123456789000"
        required
        @input="(cpf = $event), onInputCPF()"
      />
    </v-col>
    <v-col v-if="showInscricoes" cols="12">
      <span v-if="inscricoes.length" class="text-h5"
        >Inscrições de: {{ aluno.nome || "" }}</span
      >
      <CoreList
        v-if="inscricoes.length"
        class="mt-4"
        :elevation="4"
        :items="inscricoes"
        :item-text="(i) => `Etapa: ${getEtapaProcesso(i.processoEtapaId)}`"
        item-text-subtitle
      >
        <template #itemTextSubtitle="{ item }">
          <CoreChip :color="getChipColor(item.status)" :text="item.status" />
        </template>
        <template #actions="{ item }">
          <v-row>
            <v-col class="pa-1">
              <CoreButton
                icon="mdi-text-box-search"
                icon-rounded
                tooltip="Visualizar"
                :size="mobile ? 'small' : 'default'"
                @click.stop="onClickVisualizar(item)"
              />
            </v-col>
          </v-row>
        </template>
      </CoreList>
      <v-alert
        v-else
        type="warning"
        title="Nenhuma inscrição encontrada."
      ></v-alert>
    </v-col>
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
const cpf = ref(null);
const showMessage = ref(false);
const message = ref("");
const showInscricoes = ref(false);
const aluno = ref(null);
const inscricoes = ref(null);

const { data: processo } = await useFetch("/api/processos/em-andamento");

const { data: etapasProcesso, error: errorEtapas } = await useFetch(
  "/api/processo-etapas",
  {
    query: {
      processoId: processo.value.id,
    },
  },
);

onMounted(() => {
  if (
    errorEtapas.value ||
    (etapasProcesso.value && etapasProcesso.value.error)
  ) {
    errorEtapas.value
      ? (message.value = errorEtapas.value.message)
      : (message.value = etapasProcesso.value.message);
    return (showMessage.value = true);
  }
});

const onInputCPF = () => {
  showInscricoes.value = false;
  if (cpf.value && cpf.value.length) cpf.value = cpf.value.replace(/\D/g, "");

  if (cpf.value && cpf.value.length == 11) {
    return validateCPF(cpf.value)
      ? carregarAluno()
      : ((message.value = "Erro: CPF Inválido."), (showMessage.value = true));
  }
};

const carregarAluno = async () => {
  const { data: alunoCarregado } = await useFetch("/api/alunos", {
    query: {
      cpf: cpf.value,
    },
  });

  if (alunoCarregado.value.statusCode || alunoCarregado.value.error) {
    return (
      (message.value = "Erro: Aluno não encontrado."),
      (showMessage.value = true)
    );
  }

  aluno.value = alunoCarregado.value.at(0);

  const { data: inscricoesAluno } = await useFetch("/api/inscricoes", {
    query: {
      alunoId: aluno.value.id,
    },
  });

  // Filtra apenas as inscrições em etapas do Processo em andamento
  const inscricoesFiltradas = inscricoesAluno.value.filter((inscricao) =>
    etapasProcesso.value.some(
      (etapa) => etapa.id === inscricao.processoEtapaId,
    ),
  );

  inscricoes.value = inscricoesFiltradas || [];
  showInscricoes.value = true;
};

const onClickVisualizar = async (inscricao) => {
  await navigateTo({
    path: "/protocolo",
    query: {
      inscricao: inscricao.id,
    },
  });
};

const getEtapaProcesso = (id) => {
  const etapa = etapasProcesso.value.find((e) => e.id == id);
  return etapa.nome;
};

const getChipColor = (status) => {
  switch (status) {
    case "PENDENTE":
      return "info";
    case "CONFIRMADO":
      return "success";
    case "CANCELADO":
      return "error";
    default:
      return "primary";
  }
};
</script>
