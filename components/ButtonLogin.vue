<template>
  <v-col cols="auto">
    <CoreHeaderButton :icon="icon" :text="text" @click="onClick" />
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
  if (!user.value) {
    await navigateTo("/login");
    return;
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    message.value = error.message;
    return (showMessage.value = true);
  }

  await navigateTo("/");
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
