<template>
  <v-form ref="form">
    <v-row class="mt-1">
      <CoreInput
        v-model="endereco.cep"
        :counter="8"
        clearable
        label="CEP"
        type="number"
        @input="(endereco.cep = $event), onChange()"
      />
      <CoreInput
        v-model="endereco.bairro"
        clearable
        label="Bairro*"
        required
        @input="(endereco.bairro = $event), onChange()"
      />
      <CoreInput
        v-model="endereco.logradouro"
        clearable
        label="Logradouro*"
        required
        :full-width="hidePolo"
        @input="(endereco.logradouro = $event), onChange()"
      />
      <CoreInput
        v-model="endereco.numero"
        clearable
        label="Número*"
        required
        type="number"
        @input="(endereco.numero = $event), onChange()"
      />
      <CoreInput
        v-model="endereco.complemento"
        clearable
        label="Complemento"
        @input="(endereco.complemento = $event), onChange()"
      />
      <CoreSelect
        v-if="!hidePolo"
        v-model="endereco.polo"
        :items="polos"
        item-title="nome"
        label="Polo*"
        required
        @input="(endereco.polo = $event), onChange()"
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
  hidePolo: {
    type: Boolean,
    default: false,
  },
});

const endereco = computed({
  get() {
    return props.modelValue;
  },
  set(dadosForm) {
    emit("input", dadosForm);
  },
});

const { data: polos } = await useFetch("/api/polos");
const form = ref(null);

const onChange = async () => {
  const { valid } = await form.value.validate();
  emit("validate", valid);
};
</script>
