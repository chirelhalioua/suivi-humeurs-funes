<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-content">
        <h1 class="register-title">Inscription</h1>
        <p class="register-subtitle">Rejoignez Les Humeurs à la Funès</p>

        <!-- Bouton Google -->
        <div class="social-login">
          <button @click="signInWithGoogle" class="google-btn" aria-label="Continuer avec Google">
            <span>Continuer avec Google</span>
          </button>
        </div>

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
              <span class="checkmark"></span>
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

// Connexion Google avec GIS
const signInWithGoogle = () => {
  google.accounts.id.initialize({
    client_id: "542946205769-56cf927j96setvvaf5434eib5qr9e2mb.apps.googleusercontent.com",
    callback: handleGoogleResponse,
  });

  google.accounts.id.prompt();
};

// Fonction de gestion de la réponse de Google
const handleGoogleResponse = async (response) => {
  try {
    const { credential } = response;

    const res = await axios.post("https://suivi-humeurs-funes.onrender.com/api/auth/google", {
      token: credential,
    });

    const { userId } = res.data;
    localStorage.setItem("userId", userId); // Stocker l'ID utilisateur
    console.log("ID utilisateur stocké avec Google:", localStorage.getItem('userId'));

    showMessage("Inscription réussie avec Google!", "success");

    // Redirection vers le profil immédiatement
    router.push("/profil");

  } catch (error) {
    showMessage("Erreur lors de l'inscription avec Google", "error");
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
}

.submit-btn.loading {
  background-color: #9e9e9e;
  pointer-events: none;
}

.loader {
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.terms-text {
  font-size: 14px;
  color: #666;
}

.checkbox-container {
  display: flex;
  align-items: center;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #4caf50;
  border-radius: 4px;
  margin-right: 8px;
}

.terms-text a {
  color: #4caf50;
  text-decoration: none;
}

.message {
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}

.message.success {
  background-color: #e8f5e9;
  color: #388e3c;
}

.message.error {
  background-color: #ffebee;
  color: #d32f2f;
}

.login-link {
  margin-top: 16px;
  text-align: center;
}

.highlight-link {
  color: #4caf50;
  text-decoration: none;
}

.highlight-link:hover {
  text-decoration: underline;
}
</style>
