<template>
  <v-row>
    <CoreFormSubtitle label="Responsável" />
    <CoreInput
      :model-value="formData.responsavelNome"
      autofocus
      clearable
      label="Nome do(a) responsável*"
      required
      @input="updateField('responsavelNome', $event)"
    />
    <CoreInput
      :model-value="formData.cpfResponsavel"
      :counter="11"
      clearable
      hint="Digite apenas números"
      label="CPF do(a) responsável"
      persistent-hint
      placeholder="12345678901"
      @input="updateField('cpfResponsavel', $event)"
    />
    <CoreInput
      :model-value="formData.email"
      clearable
      label="E-mail do(a) responsável"
      placeholder="email@email.com"
      @input="updateField('email', $event)"
    />
    <CoreInput
      :model-value="formData.conselheiroNome"
      clearable
      label="Nome do(a) conselheiro(a)"
      @input="updateField('conselheiroNome', $event)"
    />

    <CoreFormSubtitle label="Aluno(a)" />
    <CoreInput
      :model-value="formData.nome"
      label="Nome do aluno(a)*"
      required
      @input="updateField('nome', $event)"
    />
    <CoreInput
      :model-value="formData.dataNascimento"
      label="Data de nascimento*"
      type="date"
      required
      @input="updateField('dataNascimento', $event)"
    />
    <v-col cols="12" class="py-1 px-1" md="6">
      <v-select
        :items="generoOptions"
        :model-value="formData.genero"
        item-title="label"
        item-value="value"
        label="Gênero*"
        :rules="[(v) => !!v || 'Campo obrigatório']"
        variant="outlined"
        @update:model-value="updateField('genero', $event)"
      />
    </v-col>
    <v-col cols="12" class="py-1 px-1" md="6">
      <v-select
        :items="nacionalidadeOptions"
        :model-value="formData.nacionalidade"
        item-title="label"
        item-value="value"
        label="Nacionalidade*"
        :rules="[(v) => !!v || 'Campo obrigatório']"
        variant="outlined"
        @update:model-value="updateField('nacionalidade', $event)"
      />
    </v-col>
    <CoreInput
      :model-value="formData.cpfCnpj"
      :counter="14"
      :required="isCpfCnpjObrigatorio"
      clearable
      hint="Digite apenas números"
      label="CPF/CNPJ"
      persistent-hint
      @input="updateField('cpfCnpj', $event)"
    />
    <CoreInput
      :model-value="formData.protocoloRequerimentoCpf"
      :required="isProtocoloCpfObrigatorio"
      clearable
      label="Protocolo de requerimento do CPF"
      @input="updateField('protocoloRequerimentoCpf', $event)"
    />
    <CoreInput
      :model-value="formData.estadoCivilId"
      clearable
      label="ID do estado civil"
      type="number"
      @input="updateField('estadoCivilId', $event)"
    />
    <CoreInput
      :model-value="formData.racaId"
      clearable
      label="ID da raça/cor"
      type="number"
      @input="updateField('racaId', $event)"
    />
    <CoreInput
      :model-value="formData.paisOrigemId"
      clearable
      label="ID do país de origem"
      type="number"
      @input="updateField('paisOrigemId', $event)"
    />
    <CoreInput
      :model-value="formData.naturalidadeId"
      clearable
      label="ID da naturalidade"
      type="number"
      @input="updateField('naturalidadeId', $event)"
    />
    <CoreInput
      :model-value="formData.registroCivil"
      clearable
      label="Registro civil"
      @input="updateField('registroCivil', $event)"
    />
    <v-col cols="12" class="py-1 px-1">
      <v-checkbox
        :model-value="formData.nomeSocial"
        color="primary"
        hide-details
        label="Aluno(a) utiliza nome social"
        @update:model-value="updateField('nomeSocial', $event)"
      />
    </v-col>

    <CoreFormSubtitle label="Filiação" />
    <CoreInput
      :model-value="formData.nomeMae"
      clearable
      label="Nome da mãe"
      @input="updateField('nomeMae', $event)"
    />
    <CoreInput
      :model-value="formData.cpfMae"
      :counter="11"
      clearable
      hint="Digite apenas números"
      label="CPF da mãe"
      persistent-hint
      @input="updateField('cpfMae', $event)"
    />
    <CoreInput
      :model-value="formData.nomePai"
      clearable
      label="Nome do pai"
      @input="updateField('nomePai', $event)"
    />
    <CoreInput
      :model-value="formData.cpfPai"
      :counter="11"
      clearable
      hint="Digite apenas números"
      label="CPF do pai"
      persistent-hint
      @input="updateField('cpfPai', $event)"
    />

    <CoreFormSubtitle label="Documentos" />
    <CoreInput
      :model-value="formData.numeroRg"
      clearable
      label="Número do RG"
      @input="updateField('numeroRg', $event)"
    />
    <CoreInput
      :model-value="formData.orgaoExpedidorRg"
      clearable
      label="Órgão expedidor do RG"
      @input="updateField('orgaoExpedidorRg', $event)"
    />
    <CoreInput
      :model-value="formData.dataExpedicaoRg"
      clearable
      label="Data de expedição do RG"
      type="date"
      @input="updateField('dataExpedicaoRg', $event)"
    />
    <CoreInput
      :model-value="formData.certidaoNascimento"
      clearable
      label="Certidão de nascimento"
      @input="updateField('certidaoNascimento', $event)"
    />
    <CoreInput
      :model-value="formData.dataExpedicaoCertidaoNascimento"
      clearable
      label="Data de expedição da certidão"
      type="date"
      @input="updateField('dataExpedicaoCertidaoNascimento', $event)"
    />
    <CoreInput
      :model-value="formData.nis"
      clearable
      label="NIS"
      @input="updateField('nis', $event)"
    />
    <CoreInput
      :model-value="formData.pisPasep"
      clearable
      label="PIS/PASEP"
      @input="updateField('pisPasep', $event)"
    />

    <CoreFormSubtitle label="Endereço" />
    <CoreAddress
      :model-value="endereco"
      @input="updateEndereco"
      @validate="emit('validateAddress', $event)"
    />
  </v-row>
</template>

<script setup>
const props = defineProps({
  endereco: {
    type: Object,
    required: true,
  },
  formData: {
    type: Object,
    required: true,
  },
  generoOptions: {
    type: Array,
    default: () => [],
  },
  isCpfCnpjObrigatorio: {
    type: Boolean,
    default: false,
  },
  isProtocoloCpfObrigatorio: {
    type: Boolean,
    default: false,
  },
  nacionalidadeOptions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  "update:formData",
  "update:endereco",
  "validateAddress",
]);

const updateField = (field, value) => {
  emit("update:formData", {
    ...props.formData,
    [field]: value,
  });
};

const updateEndereco = (value) => {
  emit("update:endereco", value);
};
</script>
