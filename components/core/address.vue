<template>
  <v-form ref="form">
    <v-row class="mt-1">
      <CoreInput
        :model-value="endereco.cep"
        :counter="8"
        clearable
        label="CEP"
        @input="updateEnderecoField('cep', $event)"
      />
      <CoreInput
        :model-value="endereco.bairro"
        clearable
        label="Bairro*"
        required
        @input="updateEnderecoField('bairro', $event)"
      />
      <CoreInput
        :model-value="endereco.logradouro"
        clearable
        full-width
        label="Logradouro*"
        required
        @input="updateEnderecoField('logradouro', $event)"
      />
      <CoreInput
        :model-value="endereco.numero"
        clearable
        label="Número"
        type="number"
        @input="updateEnderecoField('numero', $event)"
      />
      <CoreInput
        :model-value="endereco.complemento"
        clearable
        label="Complemento"
        @input="updateEnderecoField('complemento', $event)"
      />
    </v-row>
  </v-form>
</template>

<script setup>
const emit = defineEmits(["validate", "input"]);

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const endereco = computed(() => props.modelValue || {});

const form = ref(null);
const ultimoCepBuscado = ref("");

const normalizeCep = (value) =>
  (value || "").toString().replace(/\D/g, "").slice(0, 8);

const updateEnderecoField = async (field, value) => {
  const normalizedValue = field === "cep" ? normalizeCep(value) : value;

  emit("input", {
    ...endereco.value,
    [field]: normalizedValue,
  });

  await nextTick();
  await onChange();
};

const onChange = async () => {
  const { valid } = await form.value.validate();
  emit("validate", valid);
};

watch(
  () => normalizeCep(endereco.value?.cep),
  async (cep) => {
    if (cep.length !== 8 || cep === ultimoCepBuscado.value) return;

    ultimoCepBuscado.value = cep;

    try {
      const dadosCep = await $fetch(`/api/viacep/${cep}`);

      emit("input", {
        ...endereco.value,
        cep,
        bairro: dadosCep?.bairro || endereco.value?.bairro || "",
        logradouro: dadosCep?.logradouro || endereco.value?.logradouro || "",
      });

      await nextTick();
      await onChange();
    } catch (error) {
      console.error("Erro ao buscar CEP no ViaCEP:", error);
    }
  },
);
</script>
