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
        full-width
        label="Logradouro*"
        required
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

const endereco = computed({
  get() {
    return props.modelValue;
  },
  set(dadosForm) {
    emit("input", dadosForm);
  },
});

const form = ref(null);

const onChange = async () => {
  const { valid } = await form.value.validate();
  emit("validate", valid);
};
</script>
