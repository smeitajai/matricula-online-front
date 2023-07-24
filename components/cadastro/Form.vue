<template>
  <v-form ref="form" class="pa-10" @submit.prevent="onSubmit()">
    <v-row class="mb-3">
      <CoreInput
        v-model="dadosForm.cpf"
        :counter="11"
        clearable
        full-width
        hint="Digite apenas números"
        label="CPF do aluno(a)*"
        persistent-hint
        placeholder="123456789000"
        required
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
        required
        @input="dadosForm.nome = $event"
      />

      <CoreInput
        v-model="dadosForm.dataNascimento"
        label="Data de nascimento*"
        type="date"
        required
        @input="dadosForm.dataNascimento = $event"
      />

      <CoreSelect
        v-model="dadosForm.unidade"
        :items="unidades"
        label="Unidade de Ensino*"
        required
        @input="dadosForm.unidade = $event"
      />

      <CoreSelect
        v-model="dadosForm.etapa"
        :items="etapas"
        label="Etapa*"
        required
        @input="dadosForm.etapa = $event"
      />
    </v-row>
    <v-row justify="end">
      <CoreButton label="buscar vaga" icon="mdi-magnify" type="submit" />
    </v-row>

    <CoreSnackbar
      v-model="showMessage"
      color="error"
      :message="message"
      @hide="showMessage = $event"
    />
  </v-form>
</template>

<script setup>
// Mock de Dados
const unidades = [
  { title: "CE DE CORDEIROS", value: 100 },
  { title: "CE PEDRO RIZZI", value: 200 },
  { title: "EB ANTÔNIO RAMOS", value: 300 },
];
const etapas = [
  { title: "1° ano", value: 1 },
  { title: "2° ano", value: 2 },
  { title: "3° ano", value: 3 },
];
const pessoa = {
  cpf: "06632196985",
  nome: "João da Silva",
  dataNascimento: "2020-12-01",
  unidade: "CE PEDRO RIZZI",
  etapa: "2° ano",
};
// Fim dos mocks

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["input", "submit"]);

const showAllInputs = ref(false);
const showMessage = ref(false);
const message = ref("");
const form = ref(null);

const dadosForm = computed({
  get() {
    return props.modelValue;
  },
  set(dadosForm) {
    emit("input", dadosForm);
  },
});

const onInputCPF = () => {
  showAllInputs.value = false;

  if (dadosForm.value.cpf && dadosForm.value.cpf.length == 11) {
    return validateCPF(dadosForm.value.cpf)
      ? carregarPessoa()
      : ((message.value = "Erro: CPF Inválido."), (showMessage.value = true));
  }
};

const carregarPessoa = () => {
  //Chamada para a API "do Erudio" carregando os dados da pessoa pelo CPF informado
  //Se já tiver uma inscrição para o CPF informado, deve verificar no BackEnd também
  //dadosForm.value = { ...pessoa };
  showAllInputs.value = true;
};

const onSubmit = async () => {
  const { valid } = await form.value.validate();
  if (!valid)
    return (
      (message.value = "Verifique os campos obrigatórios e tente novamente."),
      (showMessage.value = true)
    );

  if (
    dadosForm.value.email &&
    dadosForm.value.email.length &&
    !validateEmail(dadosForm.value.email)
  ) {
    return (
      (message.value = "Erro: E-mail inválido."), (showMessage.value = true)
    );
  }

  emit("submit");
};
</script>
