<template>
  <v-col cols="auto">
    <v-tooltip :text="text" location="top">
      <template #activator="{ props }">
        <v-btn v-bind="props" :icon="icon" @click="onClick"></v-btn>
      </template>
    </v-tooltip>
  </v-col>
  <CoreSnackbar
    v-model="showMessage"
    color="red"
    :message="message"
    @hide="showMessage = $event"
  />
</template>

<script setup>
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const text = ref("");
const icon = ref("");
const showMessage = ref(false);
const message = ref("");

const onClick = async () => {
  if (user.value) { // Se já estiver logado
    const { error } = await supabase.auth.signOut();
    if (error) {
      message.value = error.message;
      return showMessage.value = true;
    }
    navigateTo("/");
  } else {
    navigateTo("/login");
  }
};

watchEffect(() => {
  if (user.value) {
    text.value = "Sair";
    icon.value = "mdi-logout";
  } else {
    text.value = "Entrar";
    icon.value = "mdi-login";
  }
});

</script>
