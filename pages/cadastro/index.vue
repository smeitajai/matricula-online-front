<template>
  <v-form class="pa-10">
    <v-row class="mb-3">
      <CoreInput
        v-model="dadosForm.cpf"
        :counter="11"
        clearable
        full-width
        hint="Digite apenas números"
        label="CPF do aluno(a)"
        persistent-hint
        placeholder="123456789000"
        type="number"
        @input="(dadosForm.cpf = $event), onInputCPF()"
      />
    </v-row>
    <v-row v-if="showAllInputs">
      <CoreInput
        v-model="dadosForm.email"
        autofocus
        clearable
        full-width
        label="E-mail do responsável"
        placeholder="email@email.com"
        @input="dadosForm.email = $event"
      />

      <CoreInput
        v-model="dadosForm.nome"
        clearable
        label="Nome do aluno(a)*"
        @input="dadosForm.nome = $event"
      />

      <CoreInput
        v-model="dadosForm.dataNascimento"
        label="Data de nascimento*"
        type="date"
        @input="dadosForm.dataNascimento = $event"
      />

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

      <v-row justify="end" class="ma-0">
        <CoreButton
          label="buscar vaga"
          icon="mdi-magnify"
          rounded="xl"
          @click="onClickBuscarVaga()"
        />
      </v-row>
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
const { mobile } = useDisplay();
const router = useRouter();

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

// Mock de Dados
const unidades = ["CE DE CORDEIROS", "CE PEDRO RIZZI", "EB ANTÔNIO RAMOS"];
const etapas = ["1° ano", "2° ano", "3° ano"];
const pessoa = {
  cpf: "06632196985",
  nome: "João da Silva",
  dataNascimento: "2020-12-01",
  unidade: "CE PEDRO RIZZI",
  etapa: "2° ano",
};
// Fim dos mocks

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
  //Chamada para a API "do Erudio" carregando os dados da pessoa pelo CPF informado
  //Se já ouver uma inscrição para o CPF informado, deveria verificar no BackEnd também
  //dadosForm.value = { ...pessoa };
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

  router.push({
    path: "/cadastro/vagas",
    query: {
      cpf: dadosForm.value.cpf,
    },
  });
};
</script>
