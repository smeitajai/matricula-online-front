<template>
  <v-card class="matricula-stepper" elevation="0">
    <div class="stepper-wrapper">
      <v-stepper
        v-model="currentStep"
        :alt-labels="!mobile"
        flat
        :items="stepperItems"
        hide-actions
        class="stepper-header-only"
      >
        <template #[`item.${i}`] v-for="(_, i) in steps" :key="i" />
      </v-stepper>
    </div>

    <div v-if="mobile" class="mobile-step-title">
      <v-chip color="primary" variant="tonal" size="small" class="mobile-step-chip">
        {{ currentStep }}/{{ totalSteps }}
      </v-chip>
      {{ currentStepLabel }}
    </div>

    <v-card-text class="step-content pa-0">
      <v-window v-model="currentStep">
        <v-window-item :value="1">
          <v-form ref="stepOneForm">
            <div class="form-section">
              <div class="section-header">
                <v-icon class="section-icon" color="primary">mdi-account-circle-outline</v-icon>
                <span class="section-title">Dados do Aluno(a)</span>
              </div>

              <div class="fields-group">
                <span class="fields-group-label">Identificação</span>
                <v-row dense>
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
                  <v-col cols="12" class="py-1 px-1" md="6">
                    <v-select
                      :items="generoOptions"
                      :model-value="formData.genero"
                      item-title="label"
                      item-value="value"
                      label="Gênero*"
                      :rules="[(v) => !!v || 'Campo obrigatório']"
                      variant="outlined"
                      @update:model-value="updateGenero($event)"
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
                    v-if="isAlunoEstrangeiro"
                    :model-value="formData.protocoloRequerimentoCpf"
                    :required="isProtocoloCpfObrigatorio"
                    clearable
                    label="Protocolo de requerimento do CPF"
                    @input="updateField('protocoloRequerimentoCpf', $event)"
                  />
                </v-row>
              </div>

              <v-divider class="section-divider" />

              <div class="fields-group">
                <span class="fields-group-label">Filiação</span>
                <v-row dense>
                  <CoreInput
                    :model-value="formData.nomeMae"
                    clearable
                    label="Filiação 1 *"
                    required
                    @input="updateField('nomeMae', $event)"
                  />
                  <CoreInput
                    :model-value="formData.cpfMae"
                    :counter="11"
                    clearable
                    :loading="loading"
                    hint="Digite apenas números"
                    label="CPF da filiação 1 *"
                    required
                    persistent-hint
                    @input="updateField('cpfMae', $event)"
                  />
                  <CoreInput
                    :model-value="formData.nomePai"
                    clearable
                    label="Filiação 2"
                    @input="updateField('nomePai', $event)"
                  />
                  <CoreInput
                    :model-value="formData.cpfPai"
                    :counter="11"
                    clearable
                    hint="Digite apenas números"
                    label="CPF da filiação 2"
                    persistent-hint
                    @input="updateField('cpfPai', $event)"
                  />
                </v-row>
              </div>

              <v-divider class="section-divider" />

              <div class="fields-group">
                <span class="fields-group-label">Documentos</span>
                <v-row dense>
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
                </v-row>
              </div>
            </div>
          </v-form>
        </v-window-item>

        <v-window-item :value="2">
          <v-form ref="stepTwoForm">
            <div class="form-section">
              <div class="section-header">
                <v-icon class="section-icon" color="primary">mdi-account-tie-outline</v-icon>
                <span class="section-title">Dados do Responsável</span>
              </div>

              <div class="fields-group">
                <span class="fields-group-label">Grau de parentesco</span>
                <v-row dense>
                  <v-col cols="12" class="py-1 px-1" md="6">
                    <v-select
                      :items="grauParentescoOptions"
                      :model-value="formData.grauParentesco"
                      item-title="label"
                      item-value="value"
                      label="Grau de parentesco"
                      variant="outlined"
                      @update:model-value="updateGrauParentesco($event)"
                    />
                  </v-col>
                </v-row>
              </div>

              <v-divider class="section-divider" />

              <div class="fields-group">
                <span class="fields-group-label">Informações pessoais</span>
                <v-row dense>
                  <CoreInput
                    :model-value="formData.responsavelNome"
                    clearable
                    label="Nome do(a) responsável pela solicitação da matrícula*"
                    required
                    @input="updateField('responsavelNome', $event)"
                  />
                  <CoreInput
                    :model-value="formData.cpfResponsavel"
                    :counter="11"
                    clearable
                    hint="Digite apenas números"
                    label="CPF do(a) responsável pela solicitação da matrícula*"
                    persistent-hint
                    required
                    @input="updateField('cpfResponsavel', $event)"
                  />
                </v-row>
              </div>

              <v-divider class="section-divider" />

              <div class="fields-group">
                <span class="fields-group-label">Contato</span>
                <v-row dense>
                  <CoreInput
                    :model-value="formData.emailResponsavel"
                    clearable
                    label="E-mail do(a) responsável pela matrícula*"
                    placeholder="email@email.com"
                    required
                    @input="updateField('emailResponsavel', $event)"
                  />
                  <CoreInput
                    :model-value="formData.telefoneResponsavel"
                    clearable
                    label="Telefone do(a) responsável pela matrícula*"
                    required
                    @input="updateField('telefoneResponsavel', $event)"
                  />
                  <CoreInput
                    :model-value="formData.telefone2"
                    clearable
                    label="Telefone adicional do(a) responsável"
                    @input="updateField('telefone2', $event)"
                  />
                  <CoreInput
                    :model-value="formData.conselheiroNome"
                    clearable
                    label="Nome do(a) conselheiro(a)"
                    @input="updateField('conselheiroNome', $event)"
                  />
                </v-row>
              </div>
            </div>
          </v-form>
        </v-window-item>

        <v-window-item :value="3">
          <div class="form-section">
            <div class="section-header">
              <v-icon class="section-icon" color="primary">mdi-map-marker-outline</v-icon>
              <span class="section-title">Endereço do Aluno</span>
            </div>

            <v-alert
              v-if="showAddressStepError"
              type="error"
              variant="tonal"
              density="compact"
              class="address-alert"
            >
              Preencha os campos obrigatórios do endereço para continuar.
            </v-alert>

            <div class="address-card">
              <CoreAddress
                class="w-100"
                :rules="[(v) => !!v || 'Campo obrigatório']"
                :model-value="endereco"
                label="CEP*"
                required
                @input="updateEndereco"
                @validate="emit('validateAddress', $event)"
              />
            </div>
          </div>
        </v-window-item>

        <v-window-item :value="4">
          <v-form ref="stepFourForm">
            <div class="form-section">
              <div class="section-header">
                <v-icon class="section-icon" color="primary">mdi-tune-variant</v-icon>
                <span class="section-title">Preferências de Matrícula</span>
              </div>

              <div class="fields-group">
                <span class="fields-group-label">Localização e turno</span>
                <v-row dense>
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
                </v-row>
              </div>

              <v-divider class="section-divider" />

              <div class="fields-group">
                <span class="fields-group-label">Situação especial</span>
                <v-row dense>
                  <v-col cols="12" class="py-0 px-1">
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
                    @update:model-value="updateDocumento('anexo_cras', $event)"
                  />
                  <CoreInput
                    :model-value="formData.processoJudicial"
                    clearable
                    full-width
                    label="Processo Judicial"
                    @input="updateField('processoJudicial', $event)"
                  />
                </v-row>
              </div>
            </div>
          </v-form>
        </v-window-item>

        <v-window-item :value="5">
          <v-form ref="stepFiveForm">
            <div class="form-section">
              <div class="section-header">
                <v-icon class="section-icon" color="primary">mdi-file-document-multiple-outline</v-icon>
                <span class="section-title">Documentos</span>
              </div>

              <div class="fields-group">
                <span class="fields-group-label">Obrigatórios</span>
                <v-row dense>
                  <CoreFileInput
                    :model-value="documentos.certidao_identidade"
                    chips
                    clearable
                    label="Certidão de nascimento ou documento de identidade do estudante*"
                    required
                    @update:model-value="updateDocumento('certidao_identidade', $event)"
                  />
                  <CoreFileInput
                    :model-value="documentos.cpf_rg_responsavel"
                    chips
                    clearable
                    label="CPF e RG dos pais ou responsáveis, ou guarda*"
                    required
                    @update:model-value="updateDocumento('cpf_rg_responsavel', $event)"
                  />
                  <CoreFileInput
                    :model-value="documentos.declaracao_vacinacao"
                    chips
                    clearable
                    label="Declaração de vacinação atualizada*"
                    required
                    @update:model-value="updateDocumento('declaracao_vacinacao', $event)"
                  />
                  <CoreFileInput
                    :model-value="documentos.cartao_cns"
                    chips
                    clearable
                    label="Cartão Nacional de Saúde (CNS)*"
                    required
                    @update:model-value="updateDocumento('cartao_cns', $event)"
                  />
                  <CoreFileInput
                    :model-value="documentos.comprovante_residencia"
                    chips
                    clearable
                    label="Comprovante de residência atualizado*"
                    required
                    @update:model-value="updateDocumento('comprovante_residencia', $event)"
                  />
                  <CoreFileInput
                    :model-value="documentos.foto_estudante"
                    chips
                    clearable
                    label="Fotografia 3x4 do estudante*"
                    required
                    @update:model-value="updateDocumento('foto_estudante', $event)"
                  />
                </v-row>
              </div>

              <v-divider class="section-divider" />

              <div class="fields-group">
                <span class="fields-group-label">Complementares</span>
                <v-row dense>
                  <CoreFileInput
                    :model-value="documentos.declaracao_proprietario_residencia"
                    chips
                    clearable
                    label="Declaração do proprietário da residência"
                    @update:model-value="updateDocumento('declaracao_proprietario_residencia', $event)"
                  />
                  <CoreFileInput
                    :model-value="documentos.cartao_social"
                    chips
                    clearable
                    label="Cartão Social - NIS"
                    @update:model-value="updateDocumento('cartao_social', $event)"
                  />
                  <CoreFileInput
                    :model-value="documentos.cartao_bpc"
                    chips
                    clearable
                    label="Cartão BPC"
                    @update:model-value="updateDocumento('cartao_bpc', $event)"
                  />
                  <CoreFileInput
                    :model-value="documentos.tutela_provisoria"
                    chips
                    clearable
                    label="Tutela provisória ou comprovante do processo judicial"
                    @update:model-value="updateDocumento('tutela_provisoria', $event)"
                  />
                  <CoreFileInput
                    :model-value="documentos.laudo_medico"
                    chips
                    clearable
                    label="Laudo médico"
                    @update:model-value="updateDocumento('laudo_medico', $event)"
                  />
                </v-row>
              </div>
            </div>
          </v-form>
        </v-window-item>
      </v-window>
    </v-card-text>


    <div class="step-actions-wrapper">
      <div class="step-actions">
        <v-btn
          v-if="currentStep > 1"
          variant="outlined"
          class="nav-btn nav-btn--prev"
          @click="prevStep"
        >
          <v-icon start>mdi-arrow-left</v-icon>
          Anterior
        </v-btn>
        <div v-else class="nav-spacer" />

        <div v-if="!mobile" class="step-counter">
          <span
            v-for="s in totalSteps"
            :key="s"
            class="step-dot"
            :class="{ active: s === currentStep, done: s < currentStep }"
          />
        </div>

        <v-btn
          v-if="currentStep < totalSteps"
          color="primary"
          variant="flat"
          class="nav-btn nav-btn--next"
          @click="nextStep"
        >
          Próximo
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
        <v-btn
          v-else
          color="primary"
          variant="flat"
          class="nav-btn nav-btn--finish"
          @click="emit('submit')"
        >
          <v-icon start>mdi-check-circle-outline</v-icon>
          Concluir matrícula
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import validateCPF from "../../utils/validateCPF";

const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
  processoEtapas: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  etapaOptions: {
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

const generoOptions = [
  { label: "Masculino", value: "M" },
  { label: "Feminino", value: "F" },
  { label: "Prefiro não informar", value: "NF" },
];

const grauParentescoOptions = [
  { label: "Próprio aluno", value: "proprio_aluno" },
  { label: "Filiação 1", value: "filiacao_1" },
  { label: "Filiação 2", value: "filiacao_2" },
  { label: "Conselho tutelar", value: "conselho_tutelar" },
];

const emit = defineEmits([
  "update:formData",
  "update:genero",
  "update:endereco",
  "update:documentos",
  "buscar-por-cpf",
  "cpf-invalido",
  "validateAddress",
  "submit",
]);

const { mobile } = useDisplay();

// Stepper state
const currentStep = ref(1);
const stepOneForm = ref(null);
const stepTwoForm = ref(null);
const stepFourForm = ref(null);
const stepFiveForm = ref(null);
const showAddressStepError = ref(false);
const totalSteps = 5;

const steps = [
  { title: "Aluno", value: 1 },
  { title: "Responsável pela Matrícula", value: 2 },
  { title: "Endereço", value: 3 },
  { title: "Preferências", value: 4 },
  { title: "Documentos", value: 5 },
];

const stepperItems = computed(() =>
  mobile.value ? steps.map((step) => ({ ...step, title: "" })) : steps,
);

const currentStepLabel = computed(
  () => steps.find((step) => step.value === currentStep.value)?.title || "",
);

const isAlunoEstrangeiro = computed(
  () => props.formData.nacionalidade === "ESTRANGEIRO",
);

const validateAddressPayload = (endereco = {}) =>
  Boolean(
    endereco.cep && endereco.bairro && endereco.logradouro && endereco.numero,
  );

const validateVuetifyForm = async (formRef) => {
  const result = await formRef?.validate();
  return Boolean(result?.valid);
};

const hasValue = (value) => {
  if (typeof value === "string") return Boolean(value.trim());
  return value !== null && value !== undefined && value !== "";
};

const validateStepOnePayload = () =>
  hasValue(props.formData.cpf) &&
  hasValue(props.formData.nome) &&
  hasValue(props.formData.dataNascimento) &&
  hasValue(props.formData.genero) &&
  hasValue(props.formData.nacionalidade) &&
  (!props.isCpfCnpjObrigatorio || hasValue(props.formData.cpfCnpj)) &&
  (!props.isProtocoloCpfObrigatorio ||
    hasValue(props.formData.protocoloRequerimentoCpf));

const validateCurrentStep = async () => {
  if (currentStep.value === 1) {
    await validateVuetifyForm(stepOneForm.value);
    return validateStepOnePayload();
  }

  if (currentStep.value === 2) {
    return validateVuetifyForm(stepTwoForm.value);
  }

  if (currentStep.value === 3) {
    const isAddressValid = validateAddressPayload(props.endereco);
    showAddressStepError.value = !isAddressValid;
    emit("validateAddress", isAddressValid);
    return isAddressValid;
  }

  if (currentStep.value === 4) {
    return validateVuetifyForm(stepFourForm.value);
  }

  if (currentStep.value === 5) {
    return validateVuetifyForm(stepFiveForm.value);
  }

  return true;
};

const nextStep = async () => {
  const isStepValid = await validateCurrentStep();

  if (!isStepValid) return;
  if (currentStep.value < totalSteps) currentStep.value++;
};

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};

const updateField = (field, value) => {
  emit("update:formData", {
    ...props.formData,
    [field]: value,
  });
};

const updateGrauParentesco = (value) => {
  const responsavelPorParentesco = {
    proprio_aluno: {
      responsavelNome: props.formData.nome || "",
      cpfResponsavel: props.formData.cpf || "",
    },
    filiacao_1: {
      responsavelNome: props.formData.nomeMae || "",
      cpfResponsavel: props.formData.cpfMae || "",
    },
    filiacao_2: {
      responsavelNome: props.formData.nomePai || "",
      cpfResponsavel: props.formData.cpfPai || "",
    },
  };
  const dadosResponsavel = responsavelPorParentesco[value] || {};

  emit("update:formData", {
    ...props.formData,
    ...dadosResponsavel,
    grauParentesco: value,
    conselheiroNome: value === "conselho_tutelar"
      ? props.formData.conselheiroNome
      : "",
  });
};

const updateGenero = (value) => {
  updateField("genero", value);
  emit("update:genero", value);
};

const updateAlunoEstrangeiro = (value) => {
  const isEstrangeiro = Boolean(value);

  emit("update:formData", {
    ...props.formData,
    nacionalidade: isEstrangeiro ? "ESTRANGEIRO" : "BRASILEIRO",
    protocoloRequerimentoCpf: isEstrangeiro
      ? props.formData.protocoloRequerimentoCpf
      : "",
  });
};

const updateEndereco = (value) => {
  showAddressStepError.value = false;
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

<style scoped>
.matricula-stepper {
  background:
    linear-gradient(
      180deg,
      rgba(var(--v-theme-surface), 1) 0%,
      rgba(var(--v-theme-surface), 0.98) 100%
    );
  border-radius: 12px;
  overflow: visible;
  border: 1px solid rgba(var(--v-border-color), 0.45);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
}

.stepper-wrapper {
  background:
    linear-gradient(
      135deg,
      rgba(var(--v-theme-primary), 0.08) 0%,
      rgba(var(--v-theme-surface), 1) 45%
    );
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.stepper-header-only :deep(.v-stepper-header) {
  box-shadow: none;
}

.step-content {
  min-height: 420px;
  overflow: visible;
  background:
    linear-gradient(
      180deg,
      rgba(var(--v-theme-surface), 0.9) 0%,
      rgba(var(--v-theme-surface-bright), 0.95) 100%
    );
}

.mobile-step-title {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  font-size: 0.92rem;
  color: rgba(var(--v-theme-on-surface), 0.76);
  font-weight: 600;
}

.mobile-step-chip {
  font-weight: 700;
}

.form-section {
  padding: 28px 24px 18px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.section-icon {
  padding: 10px;
  border-radius: 12px;
  background: rgba(var(--v-theme-primary), 0.08);
}

.section-title {
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: rgba(var(--v-theme-on-surface), 0.9);
}

.fields-group {
  margin-bottom: 8px;
}

.fields-group-label {
  display: inline-flex;
  align-items: center;
  margin-bottom: 14px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.48);
}

.section-divider {
  margin: 18px 0 22px;
}

.address-alert {
  margin-bottom: 18px;
}

.address-card {
  padding: 4px 0;
}

.step-actions-wrapper {
  padding: 16px 24px 20px;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgba(var(--v-theme-surface), 0.82);
  backdrop-filter: blur(8px);
  border-radius: 0 0 12px 12px;
}

.step-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.nav-spacer {
  min-width: 140px;
}

.nav-btn {
  min-width: 140px;
  font-weight: 600;
  letter-spacing: 0.02em;
  border-radius: 10px;
}

.nav-btn--finish {
  min-width: 210px;
}

.step-counter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-dot {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(var(--v-theme-on-surface), 0.14);
  transition: all 0.2s ease;
}

.step-dot.done {
  width: 18px;
  background: rgba(var(--v-theme-primary), 0.35);
}

.step-dot.active {
  width: 24px;
  background: rgb(var(--v-theme-primary));
}

@media (max-width: 960px) {
  .form-section {
    padding: 22px 18px 14px;
  }

  .step-actions-wrapper {
    padding: 14px 18px 18px;
  }

  .step-actions {
    gap: 12px;
  }

  .nav-btn,
  .nav-btn--finish,
  .nav-spacer {
    min-width: unset;
  }
}

.matricula-stepper :deep(.v-card-text),
.matricula-stepper :deep(.v-window),
.matricula-stepper :deep(.v-window__container),
.matricula-stepper :deep(.v-window-item) {
  overflow: visible;
}
</style>
