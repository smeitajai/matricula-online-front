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
      <CoreSelect
        :model-value="endereco.estado"
        :items="estados"
        :disabled="enderecoPreenchidoPorCep"
        item-title="nome"
        :counter="8"
        clearable
        label="Estado"
        @input="updateEnderecoField('estado', $event)"
      />
      <CoreSelect
        :model-value="endereco.cidade"
        :items="cidades"
        :disabled="enderecoPreenchidoPorCep"
        item-title="nomeCompleto"
        :counter="8"
        clearable
        label="Cidade"
        @input="updateEnderecoField('cidade', $event)"
      />
      <CoreInput
        :model-value="endereco.bairro"
        :disabled="enderecoPreenchidoPorCep"
        clearable
        label="Bairro*"
        required
        @input="updateEnderecoField('bairro', $event)"
      />
      <CoreInput
        :model-value="endereco.logradouro"
        :disabled="enderecoPreenchidoPorCep"
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
const estados = ref([]);
const cidades = ref([]);
const enderecoPreenchidoPorCep = ref(false);

const normalizeCep = (value) =>
  (value || "").toString().replace(/\D/g, "").slice(0, 8);

onMounted(async () => {
  try {
    estados.value = (await $fetch("/api/erudio/estados")) || [];
  } catch (error) {
    estados.value = [];
    console.error("Erro ao buscar estados:", error);
  }
});

const carregarCidades = async (estadoSigla, nomeCidade) => {
  if (!estadoSigla) {
    cidades.value = [];
    return [];
  }

  const query = { estado_sigla: String(estadoSigla).toUpperCase() };
  const nome = nomeCidade != null ? String(nomeCidade).trim() : "";
  if (nome) query.nome = nome;

  try {
    const data = await $fetch("/api/erudio/cidades", { query });

    cidades.value = Array.isArray(data) ? data : [];
  } catch (error) {
    cidades.value = [];
    console.error("Erro ao buscar cidades:", error);
  }

  return cidades.value;
};

const updateEnderecoField = async (field, value) => {
  const normalizedValue = field === "cep" ? normalizeCep(value) : value;

  if (field === "estado") {
    const uf = (value?.sigla || value?.uf || "").toUpperCase();
    const cidadesEstado = await carregarCidades(uf);
    const cidadeAtual = endereco.value?.cidade;
    const cidadeSelecionada = cidadesEstado.find(
      (cidade) => cidade?.nomeCompleto === cidadeAtual?.nomeCompleto,
    );

    emit("input", {
      ...endereco.value,
      estado: normalizedValue,
      cidade: cidadeSelecionada || null,
    });

    await nextTick();
    await onChange();
    return;
  }

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
    if (cep.length !== 8) {
      enderecoPreenchidoPorCep.value = false;
      return;
    }

    try {
      const dadosCep = await $fetch(`/api/viacep/${cep}`);
      const uf = (dadosCep?.uf || "").toUpperCase();
      if (!estados.value.length) {
        estados.value = (await $fetch("/api/erudio/estados")) || [];
      }

      const estadoSelecionado =
        estados.value.find(
          (estado) =>
            (estado?.sigla || estado?.uf || "").toUpperCase() === uf,
        ) || null;

      const ufEstadoSelecionado = (
        estadoSelecionado?.sigla ||
        estadoSelecionado?.uf ||
        uf
      ).toUpperCase();

      const cidadesEstado = await carregarCidades(
        ufEstadoSelecionado,
        dadosCep?.localidade,
      );
      const cidadeSelecionada = cidadesEstado.find((cidade) => {
        return cidade?.nomeCompleto.includes(dadosCep?.localidade);
      });

      const bairroSelecionado = cidadeSelecionada?.bairros?.find((bairro) => {
        return bairro?.nome
          ?.toLowerCase()
          .includes((dadosCep?.bairro || "").toLowerCase());
      });

      emit("input", {
        ...endereco.value,
        cep,
        estado: estadoSelecionado,
        logradouro: endereco.value?.logradouro || dadosCep?.logradouro || "",
        bairro: endereco.value?.bairro || dadosCep?.bairro || "",
        cidade: cidadeSelecionada.nomeCompleto,
        cidadeId: cidadeSelecionada.id,
        bairroId: bairroSelecionado?.id,
      });

      enderecoPreenchidoPorCep.value = true;

      await nextTick();
      await onChange();
    } catch (error) {
      enderecoPreenchidoPorCep.value = false;
    }
  },
  { immediate: true },
);
</script>
