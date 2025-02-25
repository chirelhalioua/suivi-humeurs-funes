<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-content">
        <h1 class="register-title">Inscription</h1>
        <p class="register-subtitle">Rejoignez Les Humeurs à la Funès</p>

         <!-- Bouton Google -->
         <div class="social-login">
          <button @click="signInWithGoogle" class="google-btn">
            <span>Continuer avec Google</span>
          </button>
        </div>

        <div class="divider">
          <span>ou</span>
        </div>

        <form @submit.prevent="registerUser" class="register-form">
          <!-- Nom et Prénom -->
          <div class="form-group">
            <label for="nom" class="form-label">Nom et Prénom</label>
            <div class="input-container">
              <i class="fas fa-user input-icon"></i>
              <input
                v-model="nom"
                type="text"
                id="nom"
                class="form-input"
                placeholder="Votre nom complet"
                required
              />
            </div>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <div class="input-container">
              <i class="fas fa-envelope input-icon"></i>
              <input
                v-model="email"
                type="email"
                id="email"
                class="form-input"
                placeholder="Votre email"
                required
              />
            </div>
          </div>

          <!-- Mot de passe -->
          <div class="form-group">
            <label for="password" class="form-label">Mot de passe</label>
            <div class="input-container">
              <i class="fas fa-lock input-icon"></i>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                class="form-input"
                placeholder="Votre mot de passe"
                required
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                <i
                  :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                ></i>
              </button>
            </div>
          </div>

          <!-- Confirmation du mot de passe -->
          <div class="form-group">
            <label for="confirm-password" class="form-label"
              >Confirmer le mot de passe</label
            >
            <div class="input-container">
              <i class="fas fa-lock input-icon"></i>
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirm-password"
                class="form-input"
                placeholder="Confirmez votre mot de passe"
                required
              />
              <button
                type="button"
                class="password-toggle"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i
                  :class="
                    showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                  "
                ></i>
              </button>
            </div>
          </div>

          <!-- Conditions d'utilisation -->
          <div class="form-group terms">
            <label class="checkbox-container">
              <input type="checkbox" v-model="acceptTerms" required />
              <span class="checkmark"></span>
              <span class="terms-text">
                J'accepte les
                <NuxtLink to="/terms" class="highlight-link"
                  >conditions d'utilisation</NuxtLink
                >
              </span>
            </label>
          </div>

          <button
            type="submit"
            class="submit-btn"
            :class="{ loading: isLoading }"
          >
            <span v-if="!isLoading">S'inscrire</span>
            <span v-else class="loader"></span>
          </button>
        </form>

        <!-- Message de confirmation ou d'erreur -->
        <Transition name="fade">
          <div v-if="message" :class="['message', messageClass]">
            <i
              :class="
                messageClass === 'success'
                  ? 'fas fa-check-circle'
                  : 'fas fa-exclamation-circle'
              "
            ></i>
            {{ message }}
          </div>
        </Transition>

        <!-- Lien vers la connexion -->
        <div class="login-link">
          <p>
            Vous avez déjà un compte ?
            <NuxtLink to="/login" class="highlight-link">
              Connectez-vous ici
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const nom = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const message = ref("");
const messageClass = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const acceptTerms = ref(false);
const isLoading = ref(false);

const showMessage = (text, type) => {
  message.value = text;
  messageClass.value = type;
  setTimeout(() => {
    message.value = "";
  }, 5000);
};

const registerUser = async () => {
  if (!acceptTerms.value) {
    showMessage("Veuillez accepter les conditions d'utilisation", "error");
    return;
  }

  if (password.value !== confirmPassword.value) {
    showMessage("Les mots de passe ne correspondent pas!", "error");
    return;
  }

  try {
    isLoading.value = true;
    const response = await axios.post(
      "https://suivi-humeurs-back.onrender.com/api/auth/register",
      {
        name: nom.value,
        email: email.value,
        password: password.value,
      },
    );

    showMessage("Inscription réussie! Vous allez être redirigé...", "success");

    // Redirection après 2 secondes
    setTimeout(() => {
      navigateTo("/login");
    }, 2000);
  } catch (error) {
    if (error.response?.data?.message) {
      showMessage(error.response.data.message, "error");
    } else {
      showMessage("Une erreur est survenue lors de l'inscription", "error");
    }
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
  max-width: 500px;
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

.terms {
  margin: 24px 0;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.terms-text {
  font-size: 14px;
  color: #666;
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

.login-link {
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
  .register-content {
    padding: 24px;
  }

  .register-title {
    font-size: 24px;
  }

  .form-input {
    font-size: 14px;
  }
}
</style>
