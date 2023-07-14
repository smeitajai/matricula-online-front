<template>
  <v-container fluid class="login-page fill-height">
    <v-row justify="center">
      <v-col align-self="center" cols="12" md="8">
        <CoreCard rounded="lg" title="Matrícula On-line" toolbar>
          <v-row>
            <span class="text-h6 ma-5">
              Seja bem-vindo(a) ao novo sistema de Matrículas On-line para o
              ensino fundamental do município de Itajaí/SC!
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
            <v-col cols="12" class="pa-0">
              <span class="font-weight-bold">
                Matrícula Interna - 07/11/2023 até 10/11/2023
              </span>
            </v-col>
            <v-col cols="12" class="pa-0">
              <span>Transferência Interna - 21/11/2023 até 24/11/2023</span>
            </v-col>
            <v-col cols="12" class="pa-0">
              <span>Matrículas Novas - 05/12/2023 até 08/12/2023</span>
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
      </v-col>
      <v-col cols="12" class="mt-5">
        <v-row justify="center">
          <CoreButton
            label="clique aqui para começar"
            link="/cadastro"
            rounded="xl"
            size="x-large"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const anoEdital = new Date().getFullYear() + 1;
</script>
