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
          v-for="i in 3"
          :key="i"
          :title="`Pergunta n° ${i}`"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        ></v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>
