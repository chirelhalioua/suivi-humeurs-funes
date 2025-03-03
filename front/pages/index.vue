<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-content">
        <h1 class="login-title">Connexion</h1>
        <p class="login-subtitle">Bienvenue sur Les Humeurs à la Funès</p>

        <div class="social-login">
          <button @click="signInWithGoogle" class="google-btn">
            <span>Continuer avec Google</span>
          </button>
        </div>

        <div class="divider"><span>ou</span></div>

        <form @submit.prevent="loginUser" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input v-model="email" type="email" id="email" class="form-input" placeholder="Votre email" required />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Mot de passe</label>
            <input v-model="password" :type="showPassword ? 'text' : 'password'" id="password" class="form-input" placeholder="Votre mot de passe" required />
            <button type="button" @click="showPassword = !showPassword" class="password-toggle">
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            <span v-if="!isLoading">Se connecter</span>
            <span v-else class="loader"></span>
          </button>
        </form>

        <transition name="fade">
          <div v-if="message" :class="['message', messageClass]">{{ message }}</div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const email = ref("");
const password = ref("");
const message = ref("");
const messageClass = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const router = useRouter();

const showMessage = (text, type) => {
  message.value = text;
  messageClass.value = type;
  setTimeout(() => (message.value = ""), 5000);
};

const loginUser = async () => {
  if (!email.value || !password.value) {
    showMessage("Veuillez remplir tous les champs.", "error");
    return;
  }

  try {
    isLoading.value = true;
    const response = await axios.post("https://suivi-humeurs-funes.onrender.com/api/auth/login", {
      email: email.value,
      password: password.value,
    }, { timeout: 10000 });

    if (response.status === 200 && response.data.token) {
      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", user._id);
      showMessage("Connexion réussie!", "success");

      await router.push("/profil");
      message.value = ""; // Nettoie le message après redirection
    }
  } catch (error) {
    showMessage(error.response?.data.message || "Problème de connexion au serveur.", "error");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Variables CSS */
:root {
  --primary-color: #4caf50;
  --primary-dark: #45a049;
  --text-color: #2c1810;
  --background-color: #f4e4bc;
  --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition-timing: 300ms;
}

/* Base styles */
.home-page {
  background-color: var(--background-color);
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("/background.jpg");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: white;
  overflow: hidden;
  padding: 1rem;
}

.hero-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  width: 100%;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease forwards;
}

.hero-description {
  font-size: clamp(1rem, 3vw, 1.5rem);
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease forwards 0.3s;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: clamp(12px, 2vw, 15px) clamp(20px, 4vw, 30px);
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-timing);
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease forwards 0.6s;
}

.cta-button:hover {
  transform: translateY(-2px);
  background: var(--primary-dark);
  box-shadow: 0 6px 12px rgba(76, 175, 80, 0.2);
}

/* Concept Section */
.concept-section {
  padding: clamp(3rem, 8vw, 100px) 1rem;
}

.concept-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-header {
  text-align: center;
  margin-bottom: clamp(2rem, 6vw, 60px);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.section-header.visible {
  opacity: 1;
  transform: translateY(0);
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: var(--text-color);
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: rgba(44, 24, 16, 0.7);
}

.concept-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: clamp(1.5rem, 4vw, 2rem);
  width: 100%;
}

.concept-card {
  border: 2px solid transparent;
}

.border-animation {
  background: linear-gradient(90deg, transparent, #4caf50, #45a049, transparent);
  background-size: 200% 100%;
  animation: borderFlow 2s linear infinite;
}

.border-animation::before {
  content: "";
  position: absolute;
  inset: 0;
  background: white;
  margin: 2px;
  border-radius: 18px;
}

@keyframes borderFlow {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (min-width: 768px) {
  .concept-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .concept-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Mood Section */
.mood-section {
  padding: 100px 20px;
  background: white;
}

.mood-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 colonnes fixes */
  gap: 30px; /* Espacement entre les cartes */
  max-width: 1200px;
  margin: 0 auto;
}

.mood-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
  transition-delay: var(--delay);
  border: 2px solid #45a049;
}

.mood-card:hover {
  transform: translateY(-10px) scale(1.05); /* Zoom + léger décalage vertical */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); /* Effet d'ombre pour l'animation */
}

.mood-grid.visible .mood-card {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.mood-image-wrapper {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

.mood-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: all 0.3s ease;
}

.mood-image.loaded {
  opacity: 1;
}

.mood-content {
  padding: clamp(1rem, 3vw, 1.5rem);
}

.mood-title {
  font-size: clamp(1.1rem, 2.5vw, 1.3rem);
  color: var(--text-color);
  margin-bottom: 0.75rem;
}

.mood-subtitle {
  color: rgba(44, 24, 16, 0.7);
  margin-bottom: 0.75rem;
  font-size: clamp(0.875rem, 2vw, 1rem);
}

.mood-film {
  font-size: clamp(0.8rem, 1.8vw, 0.9rem);
  color: rgba(44, 24, 16, 0.6);
}

  @media (max-width: 768px) {
  .mood-grid {
    grid-template-columns: 1fr; /* 1 colonne pour les petits écrans */
    gap: 20px; /* Espacement ajusté pour les écrans plus petits */
  }
}
  
/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Loading and Error States */
.loading-state,
.error-state {
  padding: clamp(2rem, 5vw, 3rem);
  text-align: center;
}

.loading-spinner {
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
}

.spinner {
  width: clamp(30px, 8vw, 40px);
  height: clamp(30px, 8vw, 40px);
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Accessibility Improvements */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
