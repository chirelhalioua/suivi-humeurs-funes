<template>
  <div class="choose-mood">
    <h1>🌈 Choisissez votre humeur</h1>


    <!-- Section principale de sélection d'humeur -->
    <div v-if="!hasChosenMood" class="moods-container">
      <!-- Flèche gauche -->
      <button class="arrow-btn" @click="prevMood" :disabled="!canNavigate || hasChosenMood">
        ◀
      </button>

      <!-- Carte d'humeur avec design modernisé -->
      <div class="mood-card" v-if="currentMood">
        <img :src="currentMood.image" :alt="currentMood.title" />
        <div class="mood-info">
          <h3>{{ currentMood.title }}</h3>
          <p>{{ currentMood.subtitle }}</p>
          <p><strong>🎥 Film : </strong>{{ currentMood.film || "Non disponible" }}</p>
        </div>
      </div>

      <div v-else class="no-mood">Aucune humeur disponible</div>

      <!-- Flèche droite -->
      <button class="arrow-btn" @click="nextMood" :disabled="!canNavigate || hasChosenMood">
        ▶
      </button>
    </div>

    <!-- Actions -->
    <div v-if="!hasChosenMood" class="mood-actions">
      <button @click="chooseMood" :disabled="!canChooseMood || hasChosenMood" class="choose-btn">
        ✅ Choisir cette humeur
      </button>
    </div>

    <!-- Zone de description -->
    <div v-if="selectedMoodId" class="mood-details">
      <textarea v-model="description" placeholder="📝 Décrivez votre humeur (optionnel)"></textarea>
      <button @click="saveMood" class="save-btn">💾 Enregistrer</button>
    </div>

    <!-- Message si l'humeur est déjà choisie -->
    <div v-if="hasChosenMood" class="mood-status">
      <p class="warning">{{ moodStatusMessage }}</p>
    </div>

    <!-- Message d'erreur visible -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Données et états
const humeurs = ref([]);
const currentIndex = ref(0);
const selectedMoodId = ref(null);
const description = ref('');
const hasChosenMood = ref(false);
const moodStatusMessage = ref('');
const errorMessage = ref('');

// Charger les humeurs depuis l'API
const fetchHumeurs = async () => {
  try {
    const response = await axios.get('https://suivi-humeurs-funes.onrender.com/api/humeurs');
    humeurs.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des humeurs :', error);
    errorMessage.value = "Impossible de charger les humeurs. Veuillez réessayer plus tard.";
  }
};

// Vérifier si l'utilisateur a déjà choisi une humeur
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

// Humeur actuelle basée sur l'index
const currentMood = computed(() => humeurs.value[currentIndex.value]);

// Navigation entre les humeurs
const prevMood = () => {
  currentIndex.value = (currentIndex.value - 1 + humeurs.value.length) % humeurs.value.length;
};
const nextMood = () => {
  currentIndex.value = (currentIndex.value + 1) % humeurs.value.length;
};

// Vérifications
const canNavigate = computed(() => humeurs.value.length > 1);
const canChooseMood = computed(() => {
  const currentHour = new Date().getHours();
  return (currentHour >= 6 && currentHour < 12) || (currentHour >= 17 && currentHour < 24);
});

// Actions
const chooseMood = () => {
  if (!currentMood.value) {
    errorMessage.value = "Aucune humeur sélectionnée.";
    return;
  }

  selectedMoodId.value = currentMood.value._id;
  errorMessage.value = ''; // On enlève les erreurs si tout va bien
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
      errorMessage.value = ''; // On efface les erreurs si tout se passe bien
      checkIfMoodAlreadyChosen();
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'humeur :', error);
    errorMessage.value = "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer plus tard.";
  }
};

// Initialisation
onMounted(() => {
  fetchHumeurs();
  checkIfMoodAlreadyChosen();
});
</script>

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
    margin-bottom:20px;
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
  
  .choose-btn:hover, .save-btn:hover {
    background: #45a049;
    transform: translateY(-2px);
  }
  
  .choose-btn:disabled {
    background: #ccc;
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
  
  /* Message des horaires */
  .mood-hours {
    font-size: 1rem;
    color: #777;
    margin-top: 10px;
  }

  /* Bouton Choisir cette humeur */
.choose-btn {
  background: linear-gradient(145deg, #4CAF50, #45a049);
  color: #fff;
  border: none;
  padding: 12px 25px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.choose-btn:hover {
  background: #45a049;
  transform: scale(1.05);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.choose-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.choose-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

/* Bouton Enregistrer */
.save-btn {
  background: #2C1810;
  color: #fff;
  border: none;
  padding: 12px 25px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
}

.save-btn:hover {
  background: #2C1810;
  transform: scale(1.05);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.save-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

  </style>
