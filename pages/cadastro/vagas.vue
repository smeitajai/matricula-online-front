<template>
  <v-row class="ma-5">
    <PageTitle
      :title="`Matrícula de ${pessoa.nome || ''} | ${etapa.nome || ''}`"
    >
      <template #subtitle>
        <span>Clique na unidade de ensino pretendida para escolher a vaga</span>
      </template>
    </PageTitle>

    <v-col v-if="unidades" cols="12">
      <CoreList
        :elevation="4"
        :item-text="(i) => i.nome"
        item-text-subtitle
        :items="unidades"
        @click="onClickItem($event)"
      >
        <template #itemTextSubtitle>
          {{ endereco }}
        </template>
      </CoreList>
    </v-col>

    <CadastroDialogVagas
      v-if="dialog"
      :dialog="dialog"
      :etapa="etapa"
      :turnos="turnos"
      :unidade="unidadeSelected"
      @close="dialog = false"
      @confirm="onConfirm($event)"
    />
  </v-row>

  <CoreSnackbar
    v-model="showMessage"
    color="error"
    :message="message"
    @hide="showMessage = $event"
  />
</template>

<script setup>
const route = useRoute();
//const { data: pessoa } = useFetch("/api/pessoas", { cpf: route.query.cpf });
const { data: etapa } = await useFetch(`/api/etapas/${route.query.etapa}`);
const { data: unidades } = await useFetch("/api/unidades");
const { data: turnos } = await useFetch("/api/turnos");

onMounted(() => {
  if (unidades.value && unidades.value.error) {
    message.value = unidades.value.message;
    return (showMessage.value = true);
  }

  if (etapa.value && etapa.value.error) {
    message.value = etapa.value.message;
    return (showMessage.value = true);
  }
});

const unidadeSelected = ref(null);
const showMessage = ref(false);
const message = ref("");
const dialog = ref(false);

const onClickItem = (unidade) => {
  unidadeSelected.value = unidade;
  dialog.value = true;
};

const onConfirm = async (turno) => {
  console.log("turno :>> ", turno);
  console.log("unidade :>> ", unidadeSelected.value);
  console.log("etapa :>> ", etapa.value);
  //Chamada para a API salvando a Inscrição
  if (true) {
    dialog.value = false; // Só fechar a Dialog se salvar a Inscrição
    alert("Salvar!");
  }
};

//Mocks
const pessoa = {
  cpf: route.query.cpf,
  nome: "João da Silva",
  dataNascimento: "2020-12-01",
  unidade: "CE PEDRO RIZZI",
  etapa: route.query.etapa,
};
const endereco = "Rua teste, n° 123 - Dom Bosco | Polo 1 ";
</script>
