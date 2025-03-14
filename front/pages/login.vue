<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-content">
        <h1 class="login-title">Connexion</h1>
        <p class="login-subtitle">Bienvenue sur Les Humeurs à la Funès</p>

  
        <form @submit.prevent="loginUser" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <div class="input-container">
              <i class="fas fa-envelope input-icon"></i>
              <input v-model="email" type="email" id="email" class="form-input" placeholder="Votre email" required />
            </div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Mot de passe</label>
            <div class="input-container">
              <i class="fas fa-lock input-icon"></i>
              <input v-model="password" :type="showPassword ? 'text' : 'password'" id="password" class="form-input" placeholder="Votre mot de passe" required />
              <button type="button" @click="showPassword = !showPassword" class="password-toggle" aria-label="Afficher/Masquer le mot de passe">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">{{ isLoading ? 'Connexion...' : 'Se connecter' }}</button>
        </form>

        <div class="forgot-password">
          <router-link to="/reset-password">Vous avez oublié votre mot de passe ?</router-link>
        </div>

        <transition name="fade">
          <div v-if="message" :class="['message', messageClass]" role="alert">{{ message }}</div>
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

// Fonction pour afficher les messages d'erreur ou de succès
const showMessage = (text, type) => {
  message.value = text;
  messageClass.value = type;
  setTimeout(() => message.value = '', 5000);
};

// Fonction de connexion utilisateur
const loginUser = async () => {
  try {
    isLoading.value = true;
    console.log("Tentative de connexion avec l'email:", email.value, "et le mot de passe:", password.value);

    const response = await axios.post('https://suivi-humeurs-funes.onrender.com/api/auth/login', {
      email: email.value,
      password: password.value
    });

    console.log("Réponse API:", response); // Affiche la réponse complète

    if (response.status === 200 && response.data.userId) {
      // Stocker l'ID utilisateur dans localStorage
      localStorage.setItem('userId', response.data.userId);
      console.log("ID utilisateur enregistré:", localStorage.getItem('userId'));
      
      // Afficher un message de succès
      showMessage("Connexion réussie!", "success");
      
      // Rediriger vers la page de profil
      router.push('/profil').catch(err => console.log(err));
    } else {
      showMessage('Problème de connexion au serveur.', 'error');
    }
  } catch (error) {
    console.log("Erreur de connexion:", error.response?.data || error.message);
    showMessage(error.response?.data.message || 'Une erreur est survenue.', 'error');
  } finally {
    isLoading.value = false;
  }
};
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

  .forgot-password {
  text-align: center;
  margin-top: 16px;
}

.forgot-password a {
  color: #4caf50;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password a:hover {
  text-decoration: underline;
}
</style>
