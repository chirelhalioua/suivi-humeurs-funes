<template>
  <div class="reset-password-page">
    <div class="reset-password-container">
      <h1 class="reset-title">Réinitialisation du mot de passe</h1>
      <p class="reset-subtitle">Entrez votre email pour recevoir un lien de réinitialisation.</p>

      <form @submit.prevent="resetPassword" class="reset-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input v-model="email" type="email" id="email" class="form-input" placeholder="Votre email" required />
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">{{ isLoading ? 'Envoi en cours...' : 'Envoyer le lien' }}</button>
      </form>

      <transition name="fade">
        <div v-if="message" :class="['message', messageClass]" role="alert">{{ message }}</div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const message = ref('');
const messageClass = ref('');
const isLoading = ref(false);

const resetPassword = async () => {
  try {
    isLoading.value = true;
    const response = await axios.post('http://localhost:5000/api/auth/reset-password', { email: email.value });

    if (response.status === 200) {
      message.value = 'Un email de réinitialisation a été envoyé.';
      messageClass.value = 'success';
    } else {
      message.value = 'Erreur lors de l’envoi de l’email.';
      messageClass.value = 'error';
    }
  } catch (error) {
    message.value = error.response?.data.message || 'Une erreur est survenue.';
    messageClass.value = 'error';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.reset-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4e4bc;
}

.reset-password-container {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.reset-title {
  text-align: center;
  font-size: 28px;
  color: #2c1810;
}

.reset-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c1810;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
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
}

.submit-btn:hover {
  background-color: #45a049;
}

.message {
  text-align: center;
  margin-top: 16px;
}

.message.success {
  color: #2e7d32;
}

.message.error {
  color: #c62828;
}
</style>
