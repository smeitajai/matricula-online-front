<template>
  <v-row>
    <CoreFormSubtitle label="Aluno(a)" />
    <CoreInput
      :model-value="formData.cpf"
      :counter="11"
      clearable
      hint="Digite apenas números"
      label="CPF do aluno(a)*"
      :loading="loading"
      persistent-hint
      placeholder="12345678901"
      required
      @input="updateCpf($event)"
    />
    <CoreInput
      :model-value="formData.nome"
      autofocus
      clearable
      label="Nome do aluno(a)*"
      required
      @input="updateField('nome', $event)"
    />
    <CoreInput
      :model-value="formData.dataNascimento"
      clearable
      label="Data de nascimento*"
      required
      type="date"
      @input="updateField('dataNascimento', $event)"
    />
    <CoreInput
      :model-value="formData.email"
      clearable
      label="E-mail"
      placeholder="email@email.com"
      @input="updateField('email', $event)"
    />
    <CoreInput
      :model-value="formData.telefone1"
      clearable
      label="Telefone 1"
      @input="updateField('telefone1', $event)"
    />
    <CoreInput
      :model-value="formData.telefone2"
      clearable
      label="Telefone 2"
      @input="updateField('telefone2', $event)"
    />

    <CoreFormSubtitle label="Responsável" />
    <CoreInput
      :model-value="formData.responsavelNome"
      clearable
      label="Nome do(a) responsável*"
      required
      @input="updateField('responsavelNome', $event)"
    />
  </v-row>
</template>

<script setup>
import validateCPF from "../../utils/validateCPF";

const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:formData", "buscar-por-cpf", "cpf-invalido"]);

const updateField = (field, value) => {
  emit("update:formData", {
    ...props.formData,
    [field]: value,
  });
};

const updateCpf = (value) => {
  const cpf = (value || "").replace(/\D/g, "");

  emit("update:formData", {
    ...props.formData,
    cpf,
    cpfCnpj: cpf,
  });

  if (cpf.length !== 11) return;

  if (!validateCPF(cpf)) {
    emit("cpf-invalido");
    return;
  }

  emit("buscar-por-cpf", cpf);
};
</script>
