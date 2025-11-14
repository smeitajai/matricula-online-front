<template>
  <CoreDialog
    v-model="showDialog"
    persistent
    title="Atenção!"
    toolbar
    :width="600"
  >
    <v-row class="text-center">
      <v-col cols="12">
        O CPF informado não retornou nenhum dado do(a) aluno(a).
      </v-col>
      <v-col cols="12"> Possíveis impedimentos: </v-col>
      <v-col cols="12">
        - Neste momento, a matrícula on-line está disponível apenas para
        <!-- <span class="font-weight-bold">{{ etapaAtiva.nome || "" }}.</span> -->
        estudantes que já frequentam uma unidade de ensino municipal.
      </v-col>
      <v-col cols="12">
        - O CPF informado não está vinculado a um aluno(a).
      </v-col>
      <v-col cols="12">
        - Caso necessite fazer a matrícula na etapa de
        <span class="font-weight-bold">{{
          etapaAtiva?.nome || "'não disponível'"
        }}</span
        >, entre em contato com a Unidade de Ensino para atualizar o CPF do(a)
        aluno(a).
      </v-col>
    </v-row>
    <template #dialogActions>
      <CoreButton
        text-color="red-darken-1"
        label="FECHAR"
        variant="text"
        @click="emit('close')"
      />
    </template>
  </CoreDialog>
</template>

<script setup>
const emit = defineEmits(["close"]);
const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  etapaAtiva: {
    type: Object,
    default: null,
  },
});

const showDialog = computed({
  get() {
    return props.dialog;
  },
  set() {
    emit("close");
  },
});
</script>
