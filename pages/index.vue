<template>
  <v-container fluid class="login-page fill-height">
    <v-row justify="center">
      <v-col align-self="center" cols="12" md="8">
        <v-card class="elevation-12" rounded="lg">
          <v-toolbar color="primary">
            <v-toolbar-title>Matrícula On-line</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <h2>
              Seja bem-vindo(a) ao novo sistema de Matrículas On-line do
              município de Itajaí/SC!
            </h2>

            <br />
            <p>
              Com apenas alguns cliques, você pode realizar o processo de forma
              simples e segura.
            </p>
            <br />

            <p class="font-weight-bold">
              Matrícula Interna - 07/11/2023 até 10/11/2023
            </p>
            <p>Transferência Interna - 21/11/2023 até 24/11/2023</p>
            <p>Matrículas Novas - 05/12/2023 até 08/12/2023</p>
            <br />
            <a
              href="https://drive.google.com/file/d/1C6uFVd71HnQxWkg8czDpsYFu5Mk5poLM/view"
              target="_blank"
              class="text-h5"
              >Clique aqui para acessar o edital de matrícula
              {{ new Date().getFullYear() + 1 }}</a
            >
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" class="mt-5">
        <v-row justify="center">
          <v-btn rounded="xl" size="x-large" color="primary" to="/enrollment"
            >Clique aqui para começar</v-btn
          >
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.login-page {
  background: url("/background_mo.jpg") no-repeat center center;
  background-size: 100% 100%;
}
</style>
