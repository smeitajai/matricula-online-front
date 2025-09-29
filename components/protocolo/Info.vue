<template>
  <v-row class="ma-5 pt-10">
    <v-col cols="12" class="text-center text-h4">
      Vaga escolhida com sucesso!
    </v-col>
    <v-col cols="12" class="text-center text-h4">
      Protocolo: {{ inscricao.protocolo }}
    </v-col>
    <v-col cols="12" class="text-center font-weight-bold">
      Emitido em {{ dataAtual }}
    </v-col>
    <v-col cols="12">
      O(a) aluno(a)
      {{ inscricao.aluno.nome }} - CPF [{{ inscricao.aluno.cpf }}], teve sua
      vaga escolhida no {{ inscricao.etapa.nome }} na
      {{ inscricao.unidadeEnsino.nome }} no turno {{ inscricao.turno.nome }}.
    </v-col>
    <v-col cols="12">
      Para efetivação da matrícula no ano letivo de {{ ANO_INSCRICAO }}, o
      responsável legal deve comparecer pessoalmente na unidade de ensino até o
      dia {{ formatarData(inscricao.processoEtapa.faseFinalDataFim) }}, portando
      os seguintes documentos:
    </v-col>
    <v-col cols="12" class="pb-0">
      - Certidão de Nascimento ou Documento de identificação do aluno, com foto,
      número do CPF e com validade em todo território nacional;
    </v-col>
    <v-col cols="12" class="py-0">
      - Documento de identificação dos pais e/ou responsável legal pelo aluno,
      com foto, número do CPF e com validade em todo território nacional;
    </v-col>
    <v-col cols="12" class="py-0">
      - Tutela provisória assinada pelo juiz ou número do registro do processo
      aprovado (se for o caso);
    </v-col>
    <v-col cols="12" class="py-0">
      - Comprovante de Residência dos pais e/ou responsável legal, atualizado
      até 03 (três) meses anteriores à solicitação (fatura de água, energia
      elétrica, telefone, contrato de aluguel, fatura de cartão de crédito ou
      declaração do agente de saúde). Caso o comprovante de residência não
      esteja no nome de um dos integrantes da família, anexar declaração do
      proprietário da residência.
      <a
        id="modelo"
        href="https://drive.google.com/file/d/1VWcxK8tRSxOK-Y8yfmsQ0UoaogIjrrDo/view?usp=sharing"
        target="_blank"
        >(Modelo - clique aqui);
      </a>
    </v-col>
    <v-col cols="12" class="py-0">
      - 01 Foto 3x4 (com identificação no verso: nome e ano/série que o aluno
      frequentará em 2025);
    </v-col>
    <v-col cols="12" class="py-0">
      - Cartão Nacional de Saúde (CNS)(original e cópia);
    </v-col>
    <v-col cols="12" class="py-0">
      - Cópia da Declaração de Vacinação atualizada do aluno, em atendimento à
      Lei No. 17.821 de 10 de dezembro de 2019. Este documento é feito pela
      Unidade de Saúde do bairro onde a família reside ou através do site:
      <a href="https://comprovante-vacinal.itajai.sc.gov.br/" target="_blank"
        >https://comprovante-vacinal.itajai.sc.gov.br/
      </a>
    </v-col>
    <v-col cols="12" class="py-0">
      - Fotocópia do Cartão Social(NIS) se benefíciário do Programa Bolsa
      Família;
    </v-col>
    <v-col cols="12" class="py-0">
      - Cartão BPC - Benefício de Prestação Continuada (Caso seja beneficiado).
    </v-col>
    <v-col cols="12" class="py-0">
      - Atestado de Frequência, quando transferido de outras escolas;
    </v-col>
    <v-col cols="12" class="py-0">
      - Histórico Escolar (deverá ser entregue no máximo após <b>30 dias</b> da
      data da matrícula).
    </v-col>
    <!-- <v-col cols="12" class="text-center text-h5">
      Este documento não precisa ser impresso, uma cópia foi enviada para o
      e-mail informado no ato da inscrição.
    </v-col> -->
  </v-row>
</template>

<script setup>
import { format, utcToZonedTime } from "date-fns-tz";

const props = defineProps({
  inscricao: {
    type: Object,
    default: () => ({}),
  },
});

const ANO_INSCRICAO = new Date().getFullYear() + 1;
const dataAtual = format(new Date(), "dd/MM/yyyy");

const formatarData = (data) => {
  const dataTimeZoned = utcToZonedTime(data, "-00:00"); //Ignora o timezone, mantendo a data correta
  return format(dataTimeZoned, "dd/MM/yyyy");
};
</script>
