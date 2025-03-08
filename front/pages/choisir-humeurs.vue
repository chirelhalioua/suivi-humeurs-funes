<template>
  <div class="choose-mood">
    <h1>🌈 Choisissez votre humeur</h1>

    <div v-if="!hasChosenMood" class="moods-container">
      <button class="arrow-btn" @click="prevMood" :disabled="!canNavigate || hasChosenMood">◀</button>

      <div class="mood-card" v-if="currentMood">
        <img :src="currentMood.image" :alt="currentMood.title" />
        <div class="mood-info">
          <h3>{{ currentMood.title }}</h3>
          <p>{{ currentMood.subtitle }}</p>
          <p><strong>🎥 Film : </strong>{{ currentMood.film || "Non disponible" }}</p>
        </div>
      </div>

      <button class="arrow-btn" @click="nextMood" :disabled="!canNavigate || hasChosenMood">▶</button>
    </div>

    <div v-if="!hasChosenMood" class="mood-actions">
      <button @click="chooseMood" :disabled="!canChooseMood || hasChosenMood" class="choose-btn">
        ✅ Choisir cette humeur
      </button>
    </div>

    <div v-if="selectedMoodId" class="mood-details">
      <textarea v-model="description" placeholder="📝 Décrivez votre humeur (optionnel)"></textarea>
      <button @click="saveMood" class="save-btn">💾 Enregistrer</button>
    </div>

    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const humeurs = ref([]);
const currentIndex = ref(0);
const selectedMoodId = ref(null);
const description = ref('');
const hasChosenMood = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const fetchHumeurs = async () => {
  try {
    const response = await axios.get('https://suivi-humeurs-funes.onrender.com/api/humeurs');
    humeurs.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des humeurs :', error);
    errorMessage.value = "❌ Impossible de charger les humeurs.";
    successMessage.value = '';
  }
};

const currentMood = computed(() => humeurs.value[currentIndex.value]);
const canNavigate = computed(() => humeurs.value.length > 1);

const prevMood = () => {
  currentIndex.value = (currentIndex.value - 1 + humeurs.value.length) % humeurs.value.length;
};

const nextMood = () => {
  currentIndex.value = (currentIndex.value + 1) % humeurs.value.length;
};

const chooseMood = () => {
  if (!currentMood.value) {
    errorMessage.value = "❌ Aucune humeur sélectionnée.";
    successMessage.value = '';
    return;
  }

  selectedMoodId.value = currentMood.value._id;
};

const saveMood = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    errorMessage.value = "❌ Utilisateur non identifié.";
    successMessage.value = '';
    return;
  }

  const userMoodChoice = {
    date: new Date().toISOString().split('T')[0],
    humeurId: selectedMoodId.value,
    description: description.value || "Aucune description fournie",
    userId,
    timeOfDay: getTimeOfDay()
  };

  try {
    const response = await axios.post('https://suivi-humeurs-funes.onrender.com/api/humeurs_utilisateurs', userMoodChoice);
    console.log('Réponse API :', response);

    if (response.status === 201) {
      hasChosenMood.value = true;
      selectedMoodId.value = null;
      description.value = '';
      errorMessage.value = '';
      successMessage.value = "✅ Humeur enregistrée avec succès !";
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'humeur :', error.response || error);
    errorMessage.value = "❌ Erreur lors de l'enregistrement.";
    successMessage.value = '';
  }
};

const getTimeOfDay = () => {
  const hours = new Date().getHours();
  if (hours >= 6 && hours < 12) return 'morning';
  if (hours >= 12 && hours < 18) return 'afternoon';
  return 'evening';
};

onMounted(fetchHumeurs);
</script>
  
</style>
// Récupérer l'ID utilisateur depuis le localStorage
<style scoped>
  /* Container principal */
  .choose-mood {
    text-align: center;
    margin: 40px auto;
    max-width: 800px;
  }

  h1 {
    font-size: 2.5rem;
    color: #4CAF50;
    margin-bottom: 30px;
  }

  /* Message d'alerte */
  .warning {
    background: #ffdada;
    color: #d32f2f;
    padding: 10px;
    border-radius: 8px;
    font-weight: bold;
  }

  .error-message {
    background: #ffdada;
    color: #d32f2f;
    padding: 10px;
    border-radius: 8px;
    font-weight: bold;
    margin-top: 10px;
  }

  /* Container des humeurs */
  .moods-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  /* Cartes d'humeur */
  .mood-card {
    background: #f9f9f9;
    border: 2px solid #4CAF50;
    border-radius: 20px;
    width: 300px;
    padding: 20px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    margin-bottom: 20px;
  }

  .mood-card:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
  }

  .mood-card img {
    width: 100%;
    border-radius: 12px;
    object-fit: cover;
    margin-bottom: 15px;
  }

  .mood-info h3 {
    font-size: 1.5rem;
    color: #4CAF50;
  }

  .mood-info p {
    margin: 5px 0;
  }

  /* Boutons fléchés */
  .arrow-btn {
    background: linear-gradient(145deg, #4CAF50, #45a049);
    color: #fff;
    border: none;
    padding: 15px 20px;
    border-radius: 50px; /* Plus arrondi */
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.3s;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .arrow-btn:hover {
    background: #45a049;
    transform: scale(1.1);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }

  .arrow-btn:active {
    transform: scale(0.95);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .arrow-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    box-shadow: none;
  }

  .choose-btn,
  .save-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 50px; /* Boutons arrondis */
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
    font-size: 16px;
  }

  .choose-btn:hover,
  .save-btn:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }

  .choose-btn:disabled,
  .save-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  /* Zone de texte */
  textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    border-radius: 12px;
    border: 2px solid #ddd;
    resize: none;
    margin-top: 10px;
    transition: border-color 0.3s ease-in-out;
  }

  textarea:focus {
    border-color: #4CAF50;
    outline: none;
  }

  /* Aucune humeur */
  .no-mood {
    color: #777;
    font-size: 1.2rem;
  }

  /* Zone de description et boutons */
  .mood-details {
    margin-top: 20px;
  }
</style>
