<template>
  <v-row>
    <CoreFormSubtitle label="Aluno(a)" />
    <CoreInput
      :model-value="formData.cpf"
      :counter="11"
      clearable
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

    <CoreFormSubtitle label="Responsável" />
    <CoreInput
      :model-value="formData.responsavelNome"
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
      @input="updateField('cpfResponsavel', $event)"
    />
    <CoreInput
      :model-value="formData.conselheiroNome"
      clearable
      label="Nome do(a) conselheiro(a)"
      @input="updateField('conselheiroNome', $event)"
    />

    <CoreFormSubtitle label="Preferências" />
    <v-col cols="12" class="py-1 px-1" md="6">
      <v-select
        :items="bairrosPreferenciais"
        :loading="loadingBairros"
        :model-value="formData.bairroPreferencial"
        item-title="nome"
        item-value="nome"
        label="Bairro Preferencial*"
        :rules="[(v) => !!v || 'Campo obrigatório']"
        variant="outlined"
        @update:model-value="updateField('bairroPreferencial', $event)"
      />
    </v-col>
    <v-col cols="12" class="py-1 px-1" md="6">
      <v-select
        :items="turnoOptions"
        :model-value="formData.turnoPreferencialId"
        item-title="nome"
        item-value="id"
        label="Turno Preferencial*"
        :rules="[(v) => !!v || 'Campo obrigatório']"
        variant="outlined"
        @update:model-value="updateField('turnoPreferencialId', $event)"
      />
    </v-col>
    <v-col cols="12" class="py-1 px-1" md="6">
      <v-select
        :items="unidadeOptions"
        :model-value="formData.unidadeEnsinoId"
        item-title="nome"
        item-value="idExterno"
        label="Unidade de Ensino*"
        :rules="[(v) => !!v || 'Campo obrigatório']"
        variant="outlined"
        @update:model-value="updateField('unidadeEnsinoId', $event)"
      />
    </v-col>
    <v-col cols="12" class="py-1 px-1" md="6">
      <v-select
        :items="etapaOptions"
        :model-value="formData.etapa"
        item-title="nome"
        label="Etapa*"
        return-object
        :rules="[(v) => !!v || 'Campo obrigatório']"
        variant="outlined"
        @update:model-value="updateField('etapa', $event)"
      />
    </v-col>
    <v-col cols="12" class="py-1 px-1">
      <v-checkbox
        :model-value="formData.criancaAbrigo"
        color="primary"
        hide-details
        label="Criança em abrigo"
        @update:model-value="updateField('criancaAbrigo', $event)"
      />
    </v-col>
    <CoreFileInput
      v-if="formData.criancaAbrigo"
      :model-value="documentos.anexo_cras"
      chips
      clearable
      label="Anexo CRAS*"
      required
      @input="updateDocumento('anexo_cras', $event)"
    />
    <CoreInput
      :model-value="formData.processoJudicial"
      clearable
      full-width
      label="Processo Judicial"
      @input="updateField('processoJudicial', $event)"
    />

    <CoreFormSubtitle label="Endereço" />
    <CoreAddress
      :model-value="endereco"
      @input="updateEndereco"
      @validate="emit('validateAddress', $event)"
    />

    <CoreFormSubtitle label="Documentos Obrigatórios" />
    <CoreFileInput
      :model-value="documentos.certidao_identidade"
      chips
      clearable
      label="Certidão de nascimento ou documento de identidade do estudante*"
      required
      @input="updateDocumento('certidao_identidade', $event)"
    />
    <CoreFileInput
      :model-value="documentos.cpf_rg_responsavel"
      chips
      clearable
      label="CPF e RG dos pais ou responsáveis, ou guarda*"
      required
      @input="updateDocumento('cpf_rg_responsavel', $event)"
    />
    <CoreFileInput
      :model-value="documentos.declaracao_vacinacao"
      chips
      clearable
      label="Declaração de vacinação atualizada*"
      required
      @input="updateDocumento('declaracao_vacinacao', $event)"
    />
    <CoreFileInput
      :model-value="documentos.cartao_cns"
      chips
      clearable
      label="Cartão Nacional de Saúde (CNS)*"
      required
      @input="updateDocumento('cartao_cns', $event)"
    />
    <CoreFileInput
      :model-value="documentos.comprovante_residencia"
      chips
      clearable
      label="Comprovante de residência atualizado*"
      required
      @input="updateDocumento('comprovante_residencia', $event)"
    />
    <CoreFileInput
      :model-value="documentos.declaracao_proprietario_residencia"
      chips
      clearable
      label="Declaração do proprietário da residência"
      @input="updateDocumento('declaracao_proprietario_residencia', $event)"
    />
    <CoreFileInput
      :model-value="documentos.foto_estudante"
      chips
      clearable
      label="Fotografia 3x4 do estudante*"
      required
      @input="updateDocumento('foto_estudante', $event)"
    />
    <CoreFileInput
      :model-value="documentos.cartao_social"
      chips
      clearable
      label="Cartão Social - NIS"
      @input="updateDocumento('cartao_social', $event)"
    />
    <CoreFileInput
      :model-value="documentos.cartao_bpc"
      chips
      clearable
      label="Cartão BPC"
      @input="updateDocumento('cartao_bpc', $event)"
    />
    <CoreFileInput
      :model-value="documentos.tutela_provisoria"
      chips
      clearable
      label="Tutela provisória ou comprovante do processo judicial"
      @input="updateDocumento('tutela_provisoria', $event)"
    />
    <CoreFileInput
      :model-value="documentos.laudo_medico"
      chips
      clearable
      label="Laudo médico"
      @input="updateDocumento('laudo_medico', $event)"
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
  etapaOptions: {
    type: Array,
    default: () => [],
  },
  generoOptions: {
    type: Array,
    default: () => [],
  },
  nacionalidadeOptions: {
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
  bairrosPreferenciais: {
    type: Array,
    default: () => [],
  },
  loadingBairros: {
    type: Boolean,
    default: false,
  },
  turnoOptions: {
    type: Array,
    default: () => [],
  },
  unidadeOptions: {
    type: Array,
    default: () => [],
  },
  endereco: {
    type: Object,
    required: true,
  },
  documentos: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  "update:formData",
  "update:endereco",
  "update:documentos",
  "buscar-por-cpf",
  "cpf-invalido",
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

const updateDocumento = (field, value) => {
  emit("update:documentos", {
    ...props.documentos,
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
