<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-content">
        <h1 class="register-title">Inscription</h1>
        <p class="register-subtitle">Rejoignez Les Humeurs à la Funès</p>
      
        <div class="divider">
          <span>ou</span>
        </div>

        <!-- Formulaire d'inscription -->
        <form @submit.prevent="registerUser" class="register-form">
          <div class="form-group">
            <label for="nom" class="form-label">Nom et Prénom</label>
            <div class="input-container">
              <i class="fas fa-user input-icon"></i>
              <input v-model="nom" type="text" id="nom" class="form-input" placeholder="Votre nom complet" required />
            </div>
          </div>

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
              <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="confirm-password" class="form-label">Confirmer le mot de passe</label>
            <div class="input-container">
              <i class="fas fa-lock input-icon"></i>
              <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" id="confirm-password" class="form-input" placeholder="Confirmez votre mot de passe" required />
              <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
                {{ showConfirmPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div class="form-group terms">
            <label class="checkbox-container">
              <input type="checkbox" v-model="acceptTerms" required />
              <span class="terms-text">J'accepte les <NuxtLink to="/terms" class="highlight-link">conditions d'utilisation</NuxtLink></span>
            </label>
          </div>

          <button type="submit" class="submit-btn" :class="{ loading: isLoading }">
            <span v-if="!isLoading">S'inscrire</span>
            <span v-else class="loader"></span>
          </button>
        </form>

        <Transition name="fade">
          <div v-if="message" :class="['message', messageClass]">
            <i :class="messageClass === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
            {{ message }}
          </div>
        </Transition>

        <div class="login-link">
          <p>Vous avez déjà un compte ? <NuxtLink to="/login" class="highlight-link">Connectez-vous ici</NuxtLink></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const nom = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const message = ref('');
const messageClass = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const acceptTerms = ref(false);
const isLoading = ref(false);
const router = useRouter();

// Affichage des messages de feedback
const showMessage = (text, type) => {
  message.value = text;
  messageClass.value = type;
  setTimeout(() => {
    message.value = '';
  }, 5000);
};

// Inscription de l'utilisateur
const registerUser = async () => {
  if (!acceptTerms.value) {
    showMessage("Veuillez accepter les conditions d'utilisation", 'error');
    return;
  }

  if (password.value !== confirmPassword.value) {
    showMessage('Les mots de passe ne correspondent pas!', 'error');
    return;
  }

  try {
    isLoading.value = true;
    const response = await axios.post('https://suivi-humeurs-funes.onrender.com/api/auth/register', {
      name: nom.value,
      email: email.value,
      password: password.value,
    });

    console.log("Réponse API:", response.data);

    if (response.data?.userId) {
      // Enregistrer le userId dans le localStorage
      localStorage.setItem("userId", response.data.userId);
      console.log("User ID enregistré:", localStorage.getItem("userId"));

      // Message de confirmation d'inscription
      showMessage('Inscription réussie! Vous allez être redirigé...', 'success');

      // Redirection vers la page de login après 2 secondes
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      showMessage("Réponse inattendue de l'API", "error");
    }
  } catch (error) {
    console.error("Erreur API:", error.response?.data || error.message);
    showMessage(error.response?.data?.message || "Une erreur est survenue lors de l'inscription", 'error');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4e4bc;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.register-content {
  padding: 40px;
}

.register-title {
  font-family: "Sora", sans-serif;
  font-size: 32px;
  font-weight: bold;
  color: #2c1810;
  text-align: center;
  margin-bottom: 8px;
}

.register-subtitle {
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

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-weight: 500;
  color: #2c1810;
}

.input-container {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

.form-input {
  width: 100%;
  padding: 12px 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.submit-btn.loading {
  background-color: #6c757d;
  cursor: not-allowed;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.terms-text {
  font-size: 14px;
}

.checkbox-container {
  display: flex;
  align-items: center;
}

.message {
  margin-top: 16px;
  padding: 10px;
  text-align: center;
  border-radius: 8px;
  font-size: 14px;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
}

.login-link {
  text-align: center;
  margin-top: 20px;
}

.highlight-link {
  color: #007bff;
  text-decoration: none;
}

.highlight-link:hover {
  text-decoration: underline;
}

.divider {
  text-align: center;
  margin: 20px 0;
}

.divider span {
  font-size: 14px;
  color: #aaa;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
