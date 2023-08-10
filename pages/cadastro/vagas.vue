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
    <v-col v-if="error">
      {{ error }}
    </v-col>

    <CadastroDialogVagas
      :dialog="dialog"
      :etapa="etapa"
      :unidade="unidadeSelected"
      @close="dialog = false"
      @confirm="onConfirm($event)"
    />
  </v-row>
</template>

<script setup>
const route = useRoute();
//const { data: pessoa } = useGET("pessoas", { cpf: route.query.cpf });
const { data: etapa } = useGET(`etapas/${route.query.etapa}`);
const { data: unidades, error } = await useGET("unidades-ensino");

const unidadeSelected = ref(null);
const dialog = ref(false);

const onClickItem = (unidade) => {
  console.log("unidade :>> ", unidade);
  unidadeSelected.value = unidade;
  dialog.value = true;
};

const onConfirm = async (turno) => {
  console.log("turno :>> ", turno.nome);
  console.log("unidade :>> ", unidadeSelected.value.nome);
  console.log("etapa :>> ", etapa.value.nome);
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
