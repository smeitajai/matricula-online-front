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
        O CPF informado está vinculado a um aluno(a) que já está frequentando
        uma unidade de ensino municipal.
      </v-col>
      <v-col cols="12">
        Nesta etapa são permitidas apenas as inscrições de novos alunos.
      </v-col>
      <v-col cols="12">
        Caso necessite fazer a inscrição na etapa
        <span class="font-weight-bold">{{
          etapaAtiva?.nome || "'não disponível'"
        }}</span
        >, entre em contato com a Unidade de Ensino para regularizar a situação
        do(a) aluno(a).
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
