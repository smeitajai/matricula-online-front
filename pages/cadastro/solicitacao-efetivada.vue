<template>
  <v-container class="py-12">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="confirmation-card pa-6 pa-md-8" elevation="2">
          <h1 v-if="!preCadastroExistente" class="text-h4 font-weight-bold mb-4">
            Solicitação de matrícula efetivada com sucesso
          </h1>
          <h1 v-else class="text-h4 font-weight-bold mb-4">
            Solicitação de matrícula
          </h1>
          
          <p v-if="!preCadastroExistente" class="text-body-1 mb-3">
            A solicitação de matrícula foi efetivada com sucesso.
          </p>
          <p v-else class="text-body-1 mb-3">
            Já existe uma solicitação de matrícula para este aluno.
          </p>
          <p class="text-body-1 mb-6">
            Guarde o número do protocolo para acompanhar o andamento da
            inscrição.
            <span v-if="protocoloExibicao" class="font-weight-medium">
              Protocolo: {{ protocoloExibicao }}
            </span>
          </p>

          <div class="d-flex flex-column flex-sm-row ga-3">
            <CoreButton
              v-if="inscricaoId"
              label="Ver protocolo"
              prepend-icon="mdi-file-document-outline"
              @click="onClickVerProtocolo()"
            />
            <CoreButton
              label="Voltar ao inicio"
              prepend-icon="mdi-home-outline"
              @click="onClickInicio()"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const route = useRoute();

const inscricaoId = computed(() => route.query.inscricao || "");
const protocoloExibicao = computed(
  () => route.query.protocolo || route.query.inscricao || "",
);
const preCadastroExistente = computed(
  () => route.query.existente
);


const onClickVerProtocolo = async () => {
  await navigateTo({
    path: "/protocolo",
    query: {
      inscricao: inscricaoId.value,
    },
  });
};

const onClickInicio = async () => {
  await navigateTo({
    path: "/",
  });
};
</script>

<style scoped>
.confirmation-card {
  border-radius: 18px;
}
</style>
