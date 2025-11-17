<template>
  <v-row class="ma-5 pt-10">
    <v-col cols="12" class="text-center">
      <v-img
        src="/logo_educacao.png"
        max-width="300"
        class="mx-auto mb-4"
      ></v-img>
    </v-col>
    <v-col cols="12" class="text-center text-h4">
      Solicitação efetuada com sucesso!
    </v-col>
    <v-col cols="12" class="text-center text-h4">
      Protocolo: {{ inscricao.protocolo }}
    </v-col>
    <v-col cols="12" class="text-center font-weight-bold">
      Emitido em {{ dataAtual }}
    </v-col>
    <v-col cols="12">
      O(a) aluno(a)
      {{ inscricao.aluno.nome }} - CPF [{{ inscricao.aluno.cpf }}], esta com a
      sua matrícula garantida. Favor consultar o sistema mais tarde para
      confirmar a unidade de ensino e o turno definido.
    </v-col>
    <!-- <v-col cols="12">
      O(a) aluno(a)
      {{ inscricao.aluno.nome }} - CPF [{{ inscricao.aluno.cpf }}], foi
      encaminhado(a) para o {{ inscricao.etapa.nome }} na unidade -
      {{ inscricao.unidadeEnsino.nome }} - turno {{ inscricao.turno.nome }}.
    </v-col> -->
    <v-col cols="12" class="text-justify">
      Os documentos foram recebidos para o processo de rematrícula. Informamos
      que isso ainda não garante a rematrícula, pois todos os documentos serão
      analisados e conferidos pela escola. A matrícula só estará efetivada após
      a conferência e confirmação se todos os documentos exigidos foram
      entregues corretamente. Após a verificação, entraremos em contato para
      confirmar a conclusão do processo ou solicitar informações complementares,
      se necessário.
    </v-col>
  </v-row>
</template>

<script setup>
import { format } from "date-fns-tz";

const props = defineProps({
  inscricao: {
    type: Object,
    default: () => ({}),
  },
});

const dataAtual = format(new Date(), "dd/MM/yyyy");
</script>
