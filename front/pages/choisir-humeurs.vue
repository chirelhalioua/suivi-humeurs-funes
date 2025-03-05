<template>
  <div class="choose-mood">
    <h1>🌈 Choisissez votre humeur</h1>

    <div v-if="!hasChosenMood" class="moods-container">
      <button class="arrow-btn" @click="prevMood" :disabled="!canNavigate || hasChosenMood">
        ◀
      </button>

      <div class="mood-card" v-if="currentMood">
        <img :src="currentMood.image" :alt="currentMood.title" />
        <div class="mood-info">
          <h3>{{ currentMood.title }}</h3>
          <p>{{ currentMood.subtitle }}</p>
          <p><strong>🎥 Film : </strong>{{ currentMood.film || "Non disponible" }}</p>
        </div>
      </div>

      <div v-else class="no-mood">Aucune humeur disponible</div>

      <button class="arrow-btn" @click="nextMood" :disabled="!canNavigate || hasChosenMood">
        ▶
      </button>
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

    <div v-if="hasChosenMood" class="mood-status">
      <p class="warning">{{ moodStatusMessage }}</p>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
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
const moodStatusMessage = ref('');
const errorMessage = ref('');

const fetchHumeurs = async () => {
  try {
    const response = await axios.get('https://suivi-humeurs-funes.onrender.com/api/humeurs_utilisateurs', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    humeurs.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des humeurs :', error);
    errorMessage.value = "Impossible de charger les humeurs. Veuillez réessayer plus tard.";
  }
};

const checkIfMoodAlreadyChosen = () => {
  const storedMood = JSON.parse(localStorage.getItem('userMoodChoice'));
  const currentDate = new Date().toISOString().split('T')[0];

  if (storedMood && storedMood.date === currentDate) {
    hasChosenMood.value = true;
    moodStatusMessage.value = "Vous avez déjà choisi votre humeur pour aujourd'hui.";
  } else {
    hasChosenMood.value = false;
    moodStatusMessage.value = '';
  }
};

const currentMood = computed(() => humeurs.value[currentIndex.value]);

const prevMood = () => {
  currentIndex.value = (currentIndex.value - 1 + humeurs.value.length) % humeurs.value.length;
};

const nextMood = () => {
  currentIndex.value = (currentIndex.value + 1) % humeurs.value.length;
};

const canNavigate = computed(() => humeurs.value.length > 1);
const canChooseMood = computed(() => {
  const currentHour = new Date().getHours();
  return (currentHour >= 6 && currentHour < 12) || (currentHour >= 17 && currentHour < 24);
});

const chooseMood = () => {
  if (!currentMood.value) {
    errorMessage.value = "Aucune humeur sélectionnée.";
    return;
  }

  selectedMoodId.value = currentMood.value._id;
  errorMessage.value = '';
};

const saveMood = async () => {
  if (!selectedMoodId.value) {
    errorMessage.value = "Veuillez choisir une humeur avant d'enregistrer.";
    return;
  }

  const userMoodChoice = {
    date: new Date().toISOString().split('T')[0],
    humeurId: selectedMoodId.value,
    description: description.value || "Aucune description fournie",
  };

  try {
    const response = await axios.post('https://suivi-humeurs-funes.onrender.com/api/humeurs_utilisateurs', userMoodChoice);

    if (response.status === 200) {
      localStorage.setItem('userMoodChoice', JSON.stringify(userMoodChoice));
      hasChosenMood.value = true;
      moodStatusMessage.value = "Merci d'avoir enregistré votre humeur.";
      selectedMoodId.value = null;
      description.value = '';
      errorMessage.value = '';
      checkIfMoodAlreadyChosen();
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'humeur :', error);
    errorMessage.value = "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer plus tard.";
  }
};

onMounted(() => {
  fetchHumeurs();
  checkIfMoodAlreadyChosen();
});
</script>

<style scoped>
.choose-mood {
  text-align: center;
  margin: 40px auto;
  max-width: 800px;
}

h1 {
  font-size: 2.5rem;
  color: #4CAF50;
}

.mood-card {
  background: #f9f9f9;
  border: 2px solid #4CAF50;
  border-radius: 20px;
  width: 300px;
  padding: 20px;
}

.arrow-btn, .choose-btn, .save-btn {
  background: #4CAF50;
  color: #fff;
  border: none;
  padding: 12px 25px;
  border-radius: 50px;
}

textarea {
  width: 100%;
  height: 100px;
}

.warning, .error-message {
  background: #ffdada;
  color: #d32f2f;
}
</style>
