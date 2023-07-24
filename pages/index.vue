<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col align-self="center" cols="12" md="8">
        <HomeCard />
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
