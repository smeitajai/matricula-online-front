<template>
  <div>
    <v-app dark>
      <v-main>
        <Header v-if="$route.path != '/'" />
        <slot />
        <Footer />
      </v-main>
    </v-app>
  </div>
</template>
