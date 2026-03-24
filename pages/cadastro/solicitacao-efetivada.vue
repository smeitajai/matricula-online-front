<template>
  <v-container class="py-12">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="confirmation-card pa-6 pa-md-8" elevation="2">
          <div class="text-overline mb-2">Pre-cadastro efetivado</div>
          <h1 class="text-h4 font-weight-bold mb-4">
            Sua solicitacao de matricula foi registrada.
          </h1>
          <p class="text-body-1 mb-3">
            A solicitacao de matricula foi efetivada com sucesso e o protocolo
            ja esta disponivel para consulta.
          </p>
          <p class="text-body-1 mb-6">
            Guarde o numero do protocolo para acompanhar o andamento da
            inscricao.
            <span v-if="inscricaoId" class="font-weight-medium">
              Protocolo: {{ inscricaoId }}
            </span>
          </p>

          <div class="d-flex flex-column flex-sm-row ga-3">
            <CoreButton
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
