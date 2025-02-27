<template>
  <div class="choose-mood">
    <h1>Choisissez votre humeur</h1>

    <!-- Vérifie si l'utilisateur a déjà choisi une humeur -->
    <div v-if="hasChosenMood" class="mood-status">
      <p class="warning">{{ moodStatusMessage }}</p>
    </div>

    <!-- Section principale pour choisir une humeur -->
    <div v-if="!hasChosenMood">
      <div class="moods-container">
        <!-- Flèche gauche -->
        <button class="arrow-btn" @click="prevMood" :disabled="!canNavigate || hasChosenMood">
          ◀
        </button>

        <div class="mood-card">
          <img v-if="currentMood" :src="currentMood.image" :alt="currentMood.title" />
          <h3>{{ currentMood?.title || "Pas d'humeur disponible" }}</h3>
          <p>{{ currentMood?.subtitle || "" }}</p>
          <p><strong>Film : </strong>{{ currentMood?.film || "Film non disponible" }}</p>
        </div>

        <!-- Flèche droite -->
        <button class="arrow-btn" @click="nextMood" :disabled="!canNavigate || hasChosenMood">
          ▶
        </button>
      </div>

      <!-- Bouton pour choisir une humeur -->
      <div v-if="!hasChosenMood" class="mood-actions">
        <button
          @click="chooseMood"
          :disabled="!canChooseMood || hasChosenMood"
          class="choose-mood-btn"
        >
          Choisir cette humeur
        </button>
      </div>

      <!-- Zone pour ajouter une description après avoir choisi une humeur -->
      <div v-if="selectedMoodId" class="mood-details">
        <textarea
          v-model="description"
          placeholder="Décrivez comment vous vous sentez (optionnel)"
        ></textarea>
        <button @click="saveMood">
          Enregistrer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Données et états
const humeurs = ref([]); // Liste des humeurs
const currentIndex = ref(0); // Index de l'humeur actuelle
const selectedMoodId = ref(null); // ID de l'humeur sélectionnée
const description = ref(''); // Description entrée par l'utilisateur
const hasChosenMood = ref(false); // Statut : l'utilisateur a-t-il déjà choisi une humeur ?
const moodStatusMessage = ref(''); // Message à afficher si l'humeur est déjà choisie

// Charger les humeurs depuis l'API
const fetchHumeurs = async () => {
  try {
    const response = await axios.get('https://suivi-humeurs-funes.onrender.com/api/humeurs');
    humeurs.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des humeurs :', error);
  }
};

// Récupérer l'utilisateur connecté depuis localStorage
const getUserFromLocalStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Erreur lors de l'accès aux données utilisateur dans le localStorage :", error);
    return null;
  }
};

// Vérifier si l'utilisateur a déjà choisi une humeur dans le suivi des humeurs
const checkIfMoodAlreadyChosen = async () => {
  const user = getUserFromLocalStorage();

  if (user) {
    const userId = user._id;
    const currentDate = new Date().toISOString().split('T')[0]; // date au format YYYY-MM-DD
    const storedMood = JSON.parse(localStorage.getItem('userMoodChoice'));

    // Vérifie si une humeur est déjà enregistrée pour aujourd'hui
    if (storedMood && storedMood.userId === userId && storedMood.date === currentDate) {
      hasChosenMood.value = true;
      moodStatusMessage.value = "Vous avez déjà choisi votre humeur pour aujourd'hui.";
    } else {
      hasChosenMood.value = false;
      moodStatusMessage.value = '';
    }
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
    alert('Aucune humeur sélectionnée.');
    return;
  }

  selectedMoodId.value = currentMood.value._id;
  alert('Humeur sélectionnée. Vous pouvez maintenant ajouter une description et enregistrer.');
};

const saveMood = async () => {
  const user = getUserFromLocalStorage();
  if (!user || !selectedMoodId.value) {
    alert("Veuillez choisir une humeur avant d'enregistrer.");
    return;
  }

  const userMoodChoice = {
    userId: user._id,
    date: new Date().toISOString().split('T')[0],
    timeOfDay: new Date().getHours() < 12 ? 'morning' : 'evening',
    humeurId: selectedMoodId.value,
    description: description.value || "Aucune description fournie", // Description optionnelle
  };

  try {
    const response = await axios.post('https://suivi-humeurs-funes.onrender.com/api/humeurs_utilisateurs', userMoodChoice);

    if (response.status === 200) {
      localStorage.setItem('userMoodChoice', JSON.stringify(userMoodChoice));
      hasChosenMood.value = true;
      moodStatusMessage.value = "Merci d'avoir enregistré votre humeur.";
      selectedMoodId.value = null;
      description.value = '';
      checkIfMoodAlreadyChosen(); // Re-vérifier après l'enregistrement
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'humeur :', error);
  }
};

// Initialisation
onMounted(() => {
  fetchHumeurs();
  checkIfMoodAlreadyChosen(); // Vérification dès le chargement de la page
});
</script>

<style scoped>
.choose-mood {
  text-align: center;
  margin: 20px;
}

.moods-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.mood-card {
  border: 4px solid #ddd;
  border-radius: 16px;
  padding: 20px;
  width: 300px;
  height: 500px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s, border-color 0.3s;
  overflow: hidden;
}

.mood-card img {
  max-width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
}

.arrow-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 20px 25px;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, transform 0.2s;
}

.arrow-btn:hover {
  background-color: #45a049;
  transform: scale(1.1);
}

.arrow-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

textarea {
  width: 100%;
  height: 100px;
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.mood-details {
  margin-top: 20px;
}

.warning {
  color: red;
  font-weight: bold;
}
</style>
