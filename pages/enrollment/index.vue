<template>
  <v-form class="pa-10">
    <v-row>
      <v-col cols="12" class="pa-0 mb-5">
        <v-text-field
          v-model="pokemonName"
          label="nome pokemon"
          variant="outlined"
        />
        <v-btn
          color="primary"
          prepend-icon="mdi-magnify"
          rounded="xl"
          @click="onClickBuscarPokemon()"
          >Buscar Pokemon</v-btn
        >
        <v-chip color="green" text-color="white" variant="outlined">{{
          pokemon || "Waiting"
        }}</v-chip>
        <v-chip color="red" text-color="red" variant="outlined"
          >Um outro Chip de Teste</v-chip
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-0 mb-5">
        <v-text-field
          v-model="dadosForm.cpf"
          :counter="11"
          hint="Digite apenas números"
          label="CPF do aluno"
          persistent-hint
          placeholder="123456789000"
          type="number"
          variant="outlined"
          @input="onInputCPF()"
        />
      </v-col>
    </v-row>
    <v-row v-if="showAllInputs">
      <v-col cols="12" class="pa-0">
        <v-text-field
          v-model="dadosForm.email"
          autofocus
          label="E-mail do responsável"
          placeholder="email@email.com"
          type="text"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" md="6" class="pa-0">
        <v-text-field
          v-model="dadosForm.nome"
          :class="[{ 'mr-2': !mobile }]"
          label="Nome do aluno(a)*"
          type="text"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" md="6" class="pa-0">
        <v-text-field
          v-model="dadosForm.data_nascimento"
          :class="[{ 'ml-2': !mobile }]"
          label="Data de nascimento*"
          persistent-placeholder
          placeholder="01/01/2023"
          type="text"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" md="6" class="pa-0">
        <v-select
          v-model="dadosForm.unidade"
          :class="[{ 'mr-2': !mobile }]"
          label="Unidade de ensino*"
          variant="outlined"
          :items="unidades"
        />
      </v-col>
      <v-col cols="12" md="6" class="pa-0">
        <v-select
          v-model="dadosForm.etapa"
          :class="[{ 'ml-2': !mobile }]"
          label="Etapa*"
          variant="outlined"
          :items="etapas"
        />
      </v-col>

      <v-col cols="12" class="pa-0">
        <v-row justify="end" class="ma-0">
          <v-btn
            color="primary"
            prepend-icon="mdi-magnify"
            rounded="xl"
            @click="onClickBuscarVaga()"
            >Buscar Vaga</v-btn
          >
        </v-row>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar"
      class="mr-5"
      timeout="4000"
      rounded="xl"
      color="red"
      location="right top"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-form>
</template>

<script setup>
import { useDisplay } from "vuetify";
const runtimeConfig = useRuntimeConfig();

const dadosForm = ref({
  cpf: null,
  email: null,
  nome: null,
  dataNascimento: null,
  unidade: null,
  etapa: null,
});

const showAllInputs = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref("");

const unidades = ["CE DE CORDEIROS", "CE PEDRO RIZZI", "EB ANTÔNIO RAMOS"];
const etapas = ["1° ano", "2° ano", "3° ano"];
const pessoa = {
  cpf: "06632196985",
  nome: "João da Silva",
  dataNascimento: "2020-12-01",
  unidade: "CE PEDRO RIZZI",
  etapa: "2° ano",
};

const pokemon = ref(null);
const pokemonName = ref("");

const onClickBuscarPokemon = async () => {
  const { name, types } = await $fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName.value}`
  ).catch((error) => error.data);
  pokemon.value = types
    ? { name, type: types[0].type.name }
    : { name: "Não encontrado", type: "Undefined" };
};

const { mobile } = useDisplay();

const onInputCPF = () => {
  showAllInputs.value = false;

  if (dadosForm.value.cpf && dadosForm.value.cpf.length == 11) {
    return validateCPF(dadosForm.value.cpf)
      ? carregarPessoa()
      : ((snackbarMessage.value = "CPF Inválido. Tente novamente."),
        (snackbar.value = true));
  }
};

const carregarPessoa = () => {
  console.log("Runtime config:", runtimeConfig);
  //Chamada para a API carregando os dados da pessoa pelo CPF informado
  dadosForm.value = { ...pessoa };
  showAllInputs.value = true;
};

const onClickBuscarVaga = () => {
  if (
    dadosForm.value.email &&
    dadosForm.value.email.length &&
    !validateEmail(dadosForm.value.email)
  ) {
    return (
      (snackbarMessage.value = "E-mail inválido. Tente novamente."),
      (snackbar.value = true)
    );
  }
  console.log("Escolher vaga...");
};
</script>
