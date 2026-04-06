// https://nuxt.com/docs/api/configuration/nuxt-config

const apiBaseURL =
  process.env.NODE_ENV === "production"
    ? process.env.NUXT_PUBLIC_API_PROD || process.env.API_PROD
    : process.env.NUXT_PUBLIC_API_DEV ||
      process.env.API_DEV ||
      "http://localhost:3000";

const erudioBaseURL =
  process.env.NODE_ENV === "production"
    ? process.env.NUXT_PUBLIC_ERUDIO_URL_PROD ||
      process.env.ERUDIO_URL_PROD ||
      process.env.NUXT_PUBLIC_API_PROD ||
      process.env.API_PROD
    : process.env.NUXT_PUBLIC_ERUDIO_URL_DEV ||
      process.env.ERUDIO_URL_DEV ||
      "http://localhost";

export default defineNuxtConfig({
  devtools: { enabled: true },

  devServer: {
    port: 3001,
    host: "0.0.0.0",
  },

  supabase: {
    redirect: false,
  },

  modules: ["@nuxtjs/supabase"],

  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],

  build: {
    transpile: ["vuetify"],
  },

  runtimeConfig: {
    // The private keys which are only available within server-side
    apiSecret: "123",
    // Keys within public, will be also exposed to the client-side
    public: {
      baseURL: apiBaseURL,
      erudioBaseURL,
    },
  },

  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },

  compatibilityDate: "2024-10-09",
});
