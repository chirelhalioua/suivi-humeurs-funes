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
            <label for="email">Email</label>
            <input v-model="email" type="email" id="email" placeholder="Votre email" required />
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input v-model="password" :type="showPassword ? 'text' : 'password'" id="password" placeholder="Votre mot de passe" required />
            <button type="button" @click="showPassword = !showPassword">
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>

          <button type="submit" :disabled="isLoading">{{ isLoading ? 'Connexion...' : 'Se connecter' }}</button>
        </form>

        <transition name="fade">
          <div v-if="message" :class="['message', messageClass]">{{ message }}</div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useHead } from '@vueuse/head';

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const message = ref('');
const messageClass = ref('');
const isLoading = ref(false);
const router = useRouter();

const showMessage = (text, type) => {
  message.value = text;
  messageClass.value = type;
  setTimeout(() => message.value = '', 5000);
};

const loginUser = async () => {
  try {
    isLoading.value = true;
    const response = await axios.post('https://suivi-humeurs-funes.onrender.com/api/auth/login', {
      email: email.value,
      password: password.value
    });

    if (response.status === 200 && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      router.push('/profil').then(() => message.value = '');
    } else {
      showMessage('Problème de connexion au serveur.', 'error');
    }
  } catch (error) {
    showMessage(error.response?.data.message || 'Une erreur est survenue.', 'error');
  } finally {
    isLoading.value = false;
  }
};

// Connexion Google avec GIS
const signInWithGoogle = () => {
  google.accounts.id.initialize({
    client_id: "542946205769-56cf927j96setvvaf5434eib5qr9e2mb.apps.googleusercontent.com",
    callback: handleGoogleResponse,
  });

  google.accounts.id.prompt();
};

const handleGoogleResponse = async (response) => {
  try {
    const { credential } = response;

    const res = await axios.post("https://suivi-humeurs-funes.onrender.com/api/auth/google", {
      token: credential,
    });

    const { token, user } = res.data;
    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", user._id);

    showMessage("Connexion réussie!", "success");
    router.push("/profil");
  } catch (error) {
    showMessage("Erreur lors de la connexion avec Google", "error");
  }
};

onMounted(() => {
  if (window.google) {
    google.accounts.id.initialize({
      client_id: "542946205769-56cf927j96setvvaf5434eib5qr9e2mb.apps.googleusercontent.com",
      callback: handleGoogleResponse,
      auto_select: true, // "One Tap" sign-in
    });

    google.accounts.id.prompt();
  } else {
    showMessage("Google API non chargé", "error");
  }
});


useHead({
  script: [{ src: "https://accounts.google.com/gsi/client", async: true, defer: true }],
});
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4e4bc;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-content {
  padding: 40px;
}

.login-title {
  font-family: "Sora", sans-serif;
  font-size: 32px;
  font-weight: bold;
  color: #2c1810;
  text-align: center;
  margin-bottom: 8px;
}

.login-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 32px;
}

.social-login {
  margin-bottom: 24px;
}

.google-btn {
  width: 100%;
  padding: 12px;
  background-color: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.google-btn:hover {
  background-color: #f8f8f8;
  border-color: #d0d0d0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.google-icon {
  width: 24px;
  height: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-weight: 500;
  color: #2c1810;
  margin-bottom: 8px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #666;
}

.form-input {
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #4caf50;
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.forgot-password {
  color: #4caf50;
  text-decoration: none;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.submit-btn:hover {
  background-color: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.submit-btn.loading {
  background-color: #45a049;
  cursor: wait;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  display: inline-block;
}

.message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  margin-top: 16px;
  font-size: 14px;
}

.message.success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.message.error {
  background-color: #ffebee;
  color: #c62828;
}

.register-link {
  text-align: center;
  margin-top: 24px;
  color: #666;
}

.highlight-link {
  color: #4caf50;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.highlight-link:hover {
  color: #45a049;
  text-decoration: underline;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Media Queries */
@media (max-width: 480px) {
  .login-content {
    padding: 24px;
  }

  .form-options {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
