<template>
  <v-form ref="form" class="pa-10">
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
        :full-width="aluno && aluno.id ? false : true"
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
        v-if="aluno && aluno.id"
        v-model="dadosForm.unidade"
        :items="unidades"
        item-title="nome"
        item-value="id"
        label="Unidade de Ensino*"
        required
        @input="dadosForm.unidade = $event"
      />

      <CoreSelect
        v-model="dadosForm.etapa"
        :items="etapas"
        item-title="nome"
        item-value="id"
        label="Etapa*"
        required
        @input="dadosForm.etapa = $event"
      />
    </v-row>

    <v-row v-if="showAllInputs" justify="end">
      <CoreButton
        label="buscar vaga"
        prepend-icon="mdi-magnify"
        @click="onSubmit()"
      />
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
const { data: unidades } = await useFetch("/api/unidades");
const { data: etapas } = await useFetch("/api/etapas");

onMounted(() => {
  if (unidades.value && unidades.value.error) {
    message.value = unidades.value.message;
    return (showMessage.value = true);
  }

  if (etapas.value && etapas.value.error) {
    message.value = etapas.value.message;
    return (showMessage.value = true);
  }
});

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
const aluno = ref(null);

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
      ? carregarAluno()
      : ((message.value = "Erro: CPF Inválido."), (showMessage.value = true));
  }
};

const carregarAluno = async () => {
  //Chamada para a API "do Erudio" carregando os dados da pessoa pelo CPF informado
  //Se já tiver uma inscrição para o CPF informado, deve verificar no BackEnd também
  const { data } = await useFetch("/api/alunos", {
    query: {
      cpf: dadosForm.value.cpf,
    },
  });
  console.log("Data aluno :>> ", data);
  aluno.value = data.value;

  showAllInputs.value = true;
};

const onSubmit = async () => {
  const { valid } = await form.value.validate();
  if (!valid)
    return (
      (message.value = "Verifique os campos obrigatórios e tente novamente."),
      (showMessage.value = true)
    );

  if (dadosForm.value.email && !validateEmail(dadosForm.value.email))
    return (
      (message.value = "Erro: E-mail inválido."), (showMessage.value = true)
    );

  emit("submit", aluno.value);
};
</script>
