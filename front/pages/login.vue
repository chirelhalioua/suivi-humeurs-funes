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
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

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

const signInWithGoogle = () => {
  console.log('Google sign-in');
};
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f4e4bc;
}

.login-container {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  font-size: 32px;
}

.social-login button,
button[type='submit'] {
  width: 100%;
  padding: 12px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

button[type='submit']:disabled {
  background: #ccc;
}

.form-group {
  margin-bottom: 16px;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
}

.message {
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
}

.message.error {
  background: #ffebee;
  color: #c62828;
}
</style>
