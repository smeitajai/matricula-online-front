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
    <!-- <v-col cols="12">
      O(a) aluno(a)
      {{ inscricao.aluno.nome }} - CPF [{{ inscricao.aluno.cpf }}], esta com a
      sua matrícula garantida. Favor consultar o sistema mais tarde para
      confirmar a unidade de ensino e o turno definido.
    </v-col> -->
    <v-col cols="12">
      A solicitação na etapa do {{ inscricao.etapa.nome }} para o aluno {{ inscricao.aluno.nome }}, inscrito sob o CPF {{ inscricao.aluno.cpf }}, foi recebida pela Secretaria Municipal de Educação de Itajaí.
      O Departamento da Central de Matrículas da Secretaria Municipal de Educação realizará a análise da solicitação e entrará em contato por telefone, WhatsApp ou e-mail assim que o processo for concluído.
    </v-col>
    <v-col cols="12" class="text-justify">
      Caso sejam identificadas inconsistências nos dados ou na documentação apresentada, você será contatado pelos meios de comunicação informados.
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
