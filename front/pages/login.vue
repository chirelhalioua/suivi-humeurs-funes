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
            <input v-model="email" type="email" id="email" placeholder="Votre email" required class="form-input" />
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <div class="input-container">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" id="password" placeholder="Votre mot de passe" required class="form-input" />
              <button type="button" @click="showPassword = !showPassword" class="password-toggle">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <button type="submit" :disabled="isLoading" class="submit-btn">
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
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
  setTimeout(() => (message.value = ''), 5000);
};

const loginUser = async () => {
  try {
    isLoading.value = true;
    const response = await axios.post('https://suivi-humeurs-funes.onrender.com/api/auth/login', {
      email: email.value,
      password: password.value,
    });

    if (response.status === 200 && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      router.push('/profil').then(() => (message.value = ''));
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
  cursor: pointer;
  transition: all 0.3s ease;
}

.google-btn:hover {
  background-color: #f8f8f8;
}

.form-group {
  margin-bottom: 24px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
}

.password-toggle {
  background: none;
  border: none;
  cursor: pointer;
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
}
</style>
