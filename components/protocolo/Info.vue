<template>
  <v-row class="ma-5 pt-10">
    <v-col cols="12" class="text-center text-h4">
      Vaga escolhida com sucesso!
    </v-col>
    <v-col cols="12" class="text-center text-h4"> Protocolo: 1202300001 </v-col>
    <v-col cols="12" class="text-center font-weight-bold">
      Emitido em {{ dataAtual }}
    </v-col>
    <v-col cols="12">
      O aluno João da Silva teve sua vaga escolhida no 1° ano na E.B. Antônio
      Ramos no turno Matutino.
    </v-col>
    <v-col cols="12">
      Para efetivação da matrícula no ano letivo de 2024, você deve comparecer
      pessoalmente na unidade de ensino até o dia XX/XX/XXXX portando os
      seguintes documentos:
    </v-col>
    <v-col cols="12">
      - Certidão de Nascimento ou Documento de identificação do aluno, com foto,
      número do CPF e com validade em todo território nacional;
    </v-col>
    <v-col cols="12">
      - Documento de identificação dos pais e/ou responsável legal pelo aluno,
      com foto, número do CPF e com validade em todo território nacional;
    </v-col>
    <v-col cols="12">
      - Comprovante de Residência dos pais e/ou responsável legal, atualizado
      até 03 (três) meses anteriores à solicitação (fatura de água, energia
      elétrica, telefone, contrato de aluguel, fatura de cartão de crédito ou
      declaração do agente de saúde). Caso o comprovante de residência não
      esteja no nome de um dos integrantes da família, anexar declaração do
      proprietário da residência.
      <a
        href="https://drive.google.com/file/d/1VWcxK8tRSxOK-Y8yfmsQ0UoaogIjrrDo/view?usp=sharing"
        target="_blank"
        >(Modelo - clique aqui);
      </a>
    </v-col>
    <v-col cols="12">
      - Cópia da Declaração de Vacinação atualizada do aluno, em atendimento à
      Lei No. 17.821 de 10 de dezembro de 2019. Este documento é feito pela
      Unidade de Saúde do bairro onde a família reside ou através do site:
      <a href="https://comprovante-vacinal.itajai.sc.gov.br/" target="_blank"
        >https://comprovante-vacinal.itajai.sc.gov.br/
      </a>
    </v-col>
    <v-col cols="12" class="text-center text-h5">
      Este documento não precisa ser impresso, uma cópia foi enviada para o
      e-mail informado no ato da inscrição.
    </v-col>
  </v-row>
</template>

<script setup>
import { format } from "date-fns";

const dataAtual = format(new Date(), "dd/MM/yyyy");
</script>
