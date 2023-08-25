<template>
  <CoreCard rounded="lg" title="Matrícula On-line" toolbar>
    <v-row>
      <span class="text-h6 ma-5 text-center">
        Seja bem-vindo(a) ao novo sistema de Matrículas On-line para o ensino
        fundamental do município de Itajaí/SC!
      </span>
    </v-row>

    <v-row>
      <span class="mx-5">
        Com apenas alguns cliques, você pode realizar o processo de forma
        simples e segura.
      </span>
    </v-row>

    <v-row class="my-8 pl-5">
      <v-col cols="12" class="pa-0"> Datas Importantes: </v-col>
      <v-col
        v-for="processo in processos"
        :key="processo.id"
        cols="12"
        class="pa-0"
      >
        <span :class="[{ 'font-weight-bold': processoEmAndamento(processo) }]">
          {{ processo.nome }}:
          {{ formatarData(processo.faseInicialDataInicio) }}
          até
          {{ formatarData(processo.faseFinalDataFim) }}
        </span>
      </v-col>
    </v-row>

    <v-row>
      <a
        href="https://drive.google.com/file/d/1C6uFVd71HnQxWkg8czDpsYFu5Mk5poLM/view"
        target="_blank"
        class="text-h5 mx-5 pb-5"
        >Clique aqui para acessar o edital de matrícula {{ anoEdital }}</a
      >
    </v-row>
  </CoreCard>

  <CoreSnackbar
    v-if="processos.error"
    v-model="processos.error"
    color="error"
    :message="processos.message"
  />
</template>

<script setup>
import { format, parseISO, isAfter, isBefore } from "date-fns";

const anoEdital = new Date().getFullYear() + 1;
const { data: processos } = await useFetch("/api/processos");

const processoEmAndamento = (processo) => {
  const dataAtual = new Date();
  const dataInicio = new Date(processo.faseInicialDataInicio);
  const dataFim = new Date(processo.faseFinalDataFim);
  return isAfter(dataAtual, dataInicio) && isBefore(dataAtual, dataFim)
    ? true
    : false;
};

const formatarData = (data) => {
  return format(parseISO(data), "dd/MM/yyyy");
};
</script>
