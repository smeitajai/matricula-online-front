<template>
  <v-row class="ma-5">
    <PageTitle title="Sobre o sistema" />

    <v-col cols="12">
      O município de Itajaí/SC disponibiliza o sistema de matrículas on-line
      para facilitar o processo de inscrição nas escolas da região. <br />
      Essa plataforma moderna permite que os pais e responsáveis selecionem
      vagas em unidades de ensino de sua preferência, tornando o procedimento
      mais ágil e acessível. <br />
      Com essa iniciativa, a administração municipal busca tornar a educação
      mais eficiente e garantir o direito à educação para todos os estudantes.
    </v-col>
    <v-col cols="12">
      <v-toolbar density="compact" color="primary">
        <v-toolbar-title>Perguntas Frequentes</v-toolbar-title>
      </v-toolbar>
      <v-expansion-panels variant="accordion">
        <v-expansion-panel
          v-for="item in itens"
          :key="item.id"
          :title="`${item.id}: ${item.pergunta}`"
          :text="item.resposta"
        ></v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script setup>
const itens = [
  {
    id: 1,
    pergunta: "Como faço para iniciar o processo de matrícula online?",
    resposta:
      "Os responsáveis legais do estudante devem acessar o sistema de matrícula online a partir de qualquer dispositivo com um navegador que tenha acesso à internet. O sistema é responsivo, o que significa que ele se adapta automaticamente ao dispositivo que você está usando.",
  },
  {
    id: 2,
    pergunta:
      "Quais são as informações e os documentos necessários para o cadastro?",
    resposta:
      "Os documentos necessários são: Nome, CPF e Data de nascimento do(a) aluno(a), além do E-mail do responsável legal.",
  },
  {
    id: 3,
    pergunta: "Como escolho uma vaga para o estudante?",
    resposta:
      "Após o cadastro inicial, o sistema exibirá uma lista de vagas disponíveis. Você pode escolher uma vaga na escola de sua preferência a partir dessa lista.",
  },
  {
    id: 4,
    pergunta: "O que acontece se as vagas de uma escola se esgotarem?",
    resposta:
      "Se todas as vagas em uma escola forem preenchidas, essa unidade não aparecerá mais na lista de vagas disponíveis.",
  },
  {
    id: 5,
    pergunta: "Após escolher a vaga, o que devo fazer em seguida?",
    resposta:
      "Depois de selecionar a vaga desejada, você deverá confirmar a escolha. Após a confirmação, o sistema gerará um número de protocolo que garantirá a reserva da vaga.",
  },
  {
    id: 6,
    pergunta: "Preciso imprimir o protocolo de reserva da vaga?",
    resposta:
      // "Não é necessário imprimir o protocolo. No entanto, se você forneceu um endereço de e-mail ao fazer o cadastro, uma cópia do protocolo será enviada para esse e-mail.",
      "Não é necessário imprimir o protocolo. No entanto, você pode fazer isso utilizando o botão Imprimir, disponível ao finalizar uma inscrição.",
  },
  {
    id: 7,
    pergunta: "Qual é a última etapa do processo de matrícula?",
    resposta:
      "Na última etapa, o responsável legal deve comparecer pessoalmente à unidade de ensino escolhida para a confirmação da vaga. É importante levar os seguintes documentos: Certidão de Nascimento ou Documento de Identificação do aluno, com foto e número do CPF. Documento de Identificação dos pais e/ou responsável legal pelo aluno, com foto e número do CPF. Comprovante de Residência atualizado, emitido até 03 meses antes da solicitação. Pode ser uma fatura de água, energia elétrica, telefone, contrato de aluguel, fatura de cartão de crédito ou declaração do agente de saúde. Se o comprovante de residência não estiver no nome de um dos membros da família, é necessário anexar uma declaração do proprietário da residência. Cópia da Declaração de Vacinação atualizada do aluno, de acordo com a Lei No. 17.821 de 10 de dezembro de 2019. Você pode obter esse documento na Unidade de Saúde do bairro onde a família reside ou pelo site: https://comprovante-vacinal.itajai.sc.gov.br/.",
  },
  {
    id: 8,
    pergunta:
      "Qual é o prazo para o responsável comparecer à unidade de ensino?",
    resposta:
      "Todas as datas e prazos estão descrito no Edital de Matrícula. Certifique-se de verificar o prazo e cumprir com as datas estabelecidas.",
  },
];
</script>
