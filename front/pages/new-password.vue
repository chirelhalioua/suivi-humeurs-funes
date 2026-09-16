<template>
  <div class="new-password-page">
    <div class="new-password-container">
      <h1>Nouveau mot de passe</h1>
      <p>Choisissez votre nouveau mot de passe.</p>

      <form v-if="token && !success" @submit.prevent="submitPassword">
        <label for="password">Nouveau mot de passe</label>
        <input
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          minlength="6"
          autocomplete="new-password"
          placeholder="6 caractères minimum"
          required
        />

        <label for="confirmPassword">Confirmer le mot de passe</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          :type="showPassword ? 'text' : 'password'"
          minlength="6"
          autocomplete="new-password"
          placeholder="Retapez votre mot de passe"
          required
        />

        <label class="show-password">
          <input v-model="showPassword" type="checkbox" />
          Afficher le mot de passe
        </label>

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Modification...' : 'Modifier mon mot de passe' }}
        </button>
      </form>

      <div v-if="message" :class="['message', success ? 'success' : 'error']">
        {{ message }}
      </div>

      <NuxtLink v-if="success" class="login-link" to="/login">Se connecter</NuxtLink>
      <NuxtLink v-else-if="!token" class="login-link" to="/reset-password">Demander un nouveau lien</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const route = useRoute()
const token = String(route.query.token || '')

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const message = ref(token ? '' : 'Ce lien de réinitialisation est invalide.')
const success = ref(false)

const submitPassword = async () => {
  message.value = ''

  if (password.value.length < 6) {
    message.value = 'Le mot de passe doit comporter au moins 6 caractères.'
    return
  }

  if (password.value !== confirmPassword.value) {
    message.value = 'Les deux mots de passe ne correspondent pas.'
    return
  }

  try {
    isLoading.value = true
    const response = await axios.post(
      'https://suivi-humeurs-funes.onrender.com/api/auth/reset-password/confirm',
      { token, password: password.value }
    )

    success.value = true
    message.value = response.data?.message || 'Votre mot de passe a bien été modifié.'
  } catch (error) {
    message.value = error.response?.data?.message || 'Impossible de modifier le mot de passe.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.new-password-page{
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
  background:#f4e4bc;
}
.new-password-container{
  width:100%;
  max-width:420px;
  padding:36px;
  border-radius:18px;
  background:#fffdf8;
  box-shadow:0 10px 30px rgba(44,24,16,.12);
  color:#2c1810;
}
h1{
  margin:0 0 8px;
  text-align:center;
  font-family:"Sora",sans-serif;
  font-size:28px;
}
p{
  margin:0 0 24px;
  text-align:center;
  color:#6f5a51;
}
form{
  display:flex;
  flex-direction:column;
  gap:10px;
}
label{
  margin-top:6px;
  font-weight:600;
  font-size:14px;
}
input[type="password"],
input[type="text"]{
  width:100%;
  box-sizing:border-box;
  padding:12px 14px;
  border:1px solid #ded3c8;
  border-radius:10px;
  font:inherit;
}
input:focus{
  outline:none;
  border-color:#8e6d59;
  box-shadow:0 0 0 3px rgba(142,109,89,.12);
}
.show-password{
  display:flex;
  align-items:center;
  gap:8px;
  margin:4px 0 8px;
  font-weight:400;
}
button{
  margin-top:4px;
  padding:13px 16px;
  border:0;
  border-radius:999px;
  background:#2c1810;
  color:#fff8e9;
  font:inherit;
  font-weight:700;
  cursor:pointer;
}
button:disabled{opacity:.65;cursor:wait}
.message{
  margin-top:18px;
  padding:12px;
  border-radius:10px;
  text-align:center;
  font-size:14px;
}
.message.error{background:#fff0ed;color:#a33a2e}
.message.success{background:#edf6ea;color:#426b38}
.login-link{
  display:block;
  margin-top:16px;
  text-align:center;
  color:#2c1810;
  font-weight:700;
  text-decoration:none;
}
@media(max-width:520px){
  .new-password-container{padding:28px 20px}
  h1{font-size:24px}
}
</style>
