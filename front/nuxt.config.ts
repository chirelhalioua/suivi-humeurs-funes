import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@pinia/nuxt",
    '@nuxt/content',
    "@nuxtjs/tailwindcss", // Ajout de TailwindCSS
  ],

  runtimeConfig: {
    public: {
      apiBase: "https://suivi-humeurs-back.onrender.com/api",
    },
  },

  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
    head: {
      title: "Les Humeurs à la Funès",
      meta: [
        {
          name: "description",
          content:
            "Exprimez vos humeurs avec des GIFs et des citations de Louis de Funès",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700&display=swap",
        },
      ],
      script: [
        {
          src: "https://apis.google.com/js/platform.js",
          async: true,
          defer: true,
        },
      ],
    },
  },

  css: ["~/assets/css/main.css"],

  build: {
    transpile: ['@vueuse/head'],
    rollupOptions: {
      external: ['@vueuse/head', 'axios'] // Ajout de 'axios'
    }
  },

  compatibilityDate: "2025-01-22",
})
