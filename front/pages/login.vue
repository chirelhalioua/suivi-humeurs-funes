<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-content">
        <h1 class="login-title">Connexion</h1>
        <p class="login-subtitle">Bienvenue sur Les Humeurs à la Funès</p>

        <!-- Bouton Google -->
        <div class="social-login">
          <button @click="signInWithGoogle" class="google-btn">
            <span>Continuer avec Google</span>
          </button>
        </div>

        <div class="divider">
          <span>ou</span>
        </div>

        <form @submit.prevent="loginUser" class="login-form">
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
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" />
              <span>Se souvenir de moi</span>
            </label>
            <NuxtLink to="/forgot-password" class="forgot-password">
              Mot de passe oublié ?
            </NuxtLink>
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            <span v-if="!isLoading">Se connecter</span>
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

        <!-- Lien vers l'inscription -->
        <div class="register-link">
          <p>
            Vous n'avez pas encore de compte ?
            <NuxtLink to="/register" class="highlight-link">
              Inscrivez-vous ici
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useRuntimeConfig, useHead } from "#app";

// Configuration et router
const config = useRuntimeConfig();
const router = useRouter();

// Références réactives
const email = ref("");
const password = ref("");
const message = ref("");
const messageClass = ref("");
const showPassword = ref(false);
const rememberMe = ref(false);
const isLoading = ref(false);

// Fonction pour afficher un message
const showMessage = (text, type) => {
  message.value = text;
  messageClass.value = type;
  setTimeout(() => {
    message.value = "";
  }, 5000);
};

// Fonction de connexion avec email/mot de passe
const loginUser = async () => {
  if (!email.value || !password.value) {
    showMessage("Veuillez remplir tous les champs.", "error");
    return;
  }

  try {
    isLoading.value = true;
    const response = await axios.post('https://suivi-humeurs-back.onrender.com/api/auth/login`, {
      email: email.value,
      password: password.value,
    });

    const { token, user } = response.data;
    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", user._id);

    showMessage("Connexion réussie!", "success");

    console.log("Redirection vers le profil...");  // Log de confirmation
    router.push("/profil");  // Redirection vers la page de profil

  } catch (error) {
    showMessage(
      error.response?.data?.message || "Erreur lors de la connexion",
      "error"
    );
  } finally {
    isLoading.value = false;
  }
};

// Connexion avec Google
const signInWithGoogle = async () => {
  try {
    isLoading.value = true;
    if (!window.gapi || !window.gapi.auth2) {
      showMessage("Google API non chargé", "error");
      return;
    }

    const auth2 = window.gapi.auth2.getAuthInstance();
    const googleUser = await auth2.signIn();
    const id_token = googleUser.getAuthResponse().id_token;

    const response = await axios.post(`https://suivi-humeurs-back.onrender.com/api/auth/google`, {
      token: id_token,
    });

    const { token, user } = response.data;
    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", user._id);

    showMessage("Connexion réussie!", "success");
    router.push("/profil");
  } catch (error) {
    showMessage("Erreur lors de la connexion avec Google", "error");
  } finally {
    isLoading.value = false;
  }
};

// Charger Google API au montage
onMounted(() => {
  if (window.gapi) {
    window.gapi.load("auth2", () => {
      window.gapi.auth2.init({
        client_id: "VOTRE_CLIENT_ID_GOOGLE", // Remplacez par votre client_id Google
      });
    });
  }
});

// Ajouter le script Google API proprement
useHead({
  script: [{ src: "https://apis.google.com/js/platform.js", async: true, defer: true }],
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
