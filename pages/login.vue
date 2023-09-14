<template>
  <v-container fluid class="fill-height" @keydown.enter="() => userLogin()">
    <v-row justify="center">
      <v-col align-self="center" cols="12" md="6">
        <CoreCard rounded="lg" title="Log in" toolbar>
          <CoreInput
            v-model="email"
            clearable
            full-width
            label="E-mail"
            placeholder="email@email.com"
            @input="email = $event"
          />
          <CoreInput
            v-model="password"
            full-width
            label="Senha"
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @append-inner-click="showPassword = !showPassword"
            @input="password = $event"
          />
          <v-row justify="end" class="pa-4">
            <CoreButton label="Entrar" @click="userLogin" />
          </v-row>
        </CoreCard>
      </v-col>
    </v-row>
    <CoreSnackbar
      v-model="showMessage"
      color="red"
      :message="message"
      @hide="showMessage = $event"
    />
  </v-container>
</template>

<script setup>
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const showMessage = ref(false);
const message = ref("");

const userLogin = async () => {
  if (email.value && !validateEmail(email.value))
    return (
      (message.value = "Erro: E-mail inválido."), (showMessage.value = true)
    );

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    message.value = error.message;
    showMessage.value = true;
  } else {
    email.value = "";
    password.value = "";
  }
};

watchEffect(() => {
  if (user.value) {
    return navigateTo("/welcome");
  }
});
</script>
