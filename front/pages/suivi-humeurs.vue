<template>
  <div class="mood-tracking-page">
    <!-- Header avec navigation -->
    <div class="tracking-header">
      <h1>Suivi des Humeurs</h1>
      <div class="view-toggle">
        <button
          :class="['toggle-btn', { active: view === 'daily' }]"
          @click="changeView('daily')"
        >
          <i class="fas fa-calendar-day"></i>
          Journalier
        </button>
        <button
          :class="['toggle-btn', { active: view === 'weekly' }]"
          @click="changeView('weekly')"
        >
          <i class="fas fa-calendar-week"></i>
          Hebdomadaire
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement de vos humeurs...</p>
    </div>

    <div v-else>
      <!-- Vue Journalière -->
      <div v-if="view === 'daily'" class="daily-view">
        <div class="date-selector">
          <button class="nav-btn" @click="previousDay">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="current-date">
            <h2>{{ formatDate(selectedDate) }}</h2>
            <p>{{ days[selectedDate.getDay()] }}</p>
          </div>
          <button
            class="nav-btn"
            @click="nextDay"
            :disabled="isToday(selectedDate)"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <div class="moods-container">
          <!-- Humeur du Matin -->
          <div class="mood-card morning">
            <div class="time-label">
              <i class="fas fa-sun"></i>
              Matin
            </div>
            <div v-if="morningData[selectedDate.getDay()]" class="mood-content">
              <div class="mood-image-container">
                <img
                  :src="morningData[selectedDate.getDay()].image"
                  :alt="morningData[selectedDate.getDay()].title"
                  class="mood-image"
                />
              </div>
              <div class="mood-details">
                <h3>{{ morningData[selectedDate.getDay()].title }}</h3>
                <p>{{ morningData[selectedDate.getDay()].subtitle }}</p>
              </div>
            </div>
            <div v-else class="mood-empty">
              <i class="fas fa-cloud"></i>
              <p>Pas d'humeur enregistrée</p>
            </div>
          </div>

          <!-- Humeur du Soir -->
          <div class="mood-card evening">
            <div class="time-label">
              <i class="fas fa-moon"></i>
              Soir
            </div>
            <div v-if="eveningData[selectedDate.getDay()]" class="mood-content">
              <div class="mood-image-container">
                <img
                  :src="eveningData[selectedDate.getDay()].image"
                  :alt="eveningData[selectedDate.getDay()].title"
                  class="mood-image"
                />
              </div>
              <div class="mood-details">
                <h3>{{ eveningData[selectedDate.getDay()].title }}</h3>
                <p>{{ eveningData[selectedDate.getDay()].subtitle }}</p>
              </div>
            </div>
            <div v-else class="mood-empty">
              <i class="fas fa-cloud"></i>
              <p>Pas d'humeur enregistrée</p>
            </div>
          </div>
        </div>

        <!-- Share Button -->
        <div class="share-button">
          <button @click="shareMood('daily')">Partager mon humeur</button>
        </div>
      </div>

      <!-- Vue Hebdomadaire -->
      <div v-else class="weekly-view">
        <div class="week-grid">
          <div
            v-for="(date, index) in weekDates"
            :key="index"
            class="day-card"
            :class="{ 'current-day': isToday(date) }"
          >
            <div class="day-header">
              <h3>{{ days[date.getDay()] }}</h3>
              <p>{{ formatDateShort(date) }}</p>
            </div>

            <div class="day-moods">
              <!-- Matin -->
              <div class="mini-mood morning">
                <span class="time-indicator">Matin</span>
                <div v-if="morningData[date.getDay()]" class="mini-mood-content">
                  <img
                    :src="morningData[date.getDay()].image"
                    :alt="morningData[date.getDay()].title"
                  />
                  <span>{{ morningData[date.getDay()].title }}</span>
                </div>
                <div v-else class="mini-mood-empty">
                  <i class="fas fa-minus-circle"></i>
                </div>
              </div>

              <!-- Soir -->
              <div class="mini-mood evening">
                <span class="time-indicator">Soir</span>
                <div v-if="eveningData[date.getDay()]" class="mini-mood-content">
                  <img
                    :src="eveningData[date.getDay()].image"
                    :alt="eveningData[date.getDay()].title"
                  />
                  <span>{{ eveningData[date.getDay()].title }}</span>
                </div>
                <div v-else class="mini-mood-empty">
                  <i class="fas fa-minus-circle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Share Button -->
        <div class="share-button">
          <button @click="shareMood('weekly')">Partager ma semaine</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

// État
const view = ref("daily");
const selectedDate = ref(new Date());
const isLoading = ref(true);
const morningData = ref([]);
const eveningData = ref([]);

// Constantes
const days = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

// Dates de la semaine
const weekDates = computed(() => {
  const dates = [];
  const currentDate = new Date(selectedDate.value);
  const firstDay = new Date(
    currentDate.setDate(currentDate.getDate() - currentDate.getDay()),
  );

  for (let i = 0; i < 7; i++) {
    dates.push(
      new Date(
        firstDay.getFullYear(),
        firstDay.getMonth(),
        firstDay.getDate() + i,
      ),
    );
  }

  return dates;
});

// Formatage des dates
const formatDate = (date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatDateShort = (date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(date);
};

// Vérification si la date est aujourd'hui
const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Navigation entre les jours
const previousDay = () => {
  selectedDate.value = new Date(
    selectedDate.value.setDate(selectedDate.value.getDate() - 1),
  );
};

const nextDay = () => {
  if (!isToday(selectedDate.value)) {
    selectedDate.value = new Date(
      selectedDate.value.setDate(selectedDate.value.getDate() + 1),
    );
  }
};

// Changement de vue
const changeView = (newView) => {
  view.value = newView;
};

// Récupération des données
const fetchMoodData = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("Token non trouvé");
    return;
  }

  try {
    isLoading.value = true;

    // Récupérer l'ID utilisateur
    const userResponse = await axios.get(
      "https://suivi-humeurs-funes.onrender.com/api/auth/me",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    // Récupérer les humeurs
    const moodsResponse = await axios.get(
      `https://suivi-humeurs-funes.onrender.com/api/humeurs_utilisateurs/${userResponse.data._id}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    // Réinitialiser les tableaux
    morningData.value = Array(7).fill(null);
    eveningData.value = Array(7).fill(null);

    // Traiter les données
    for (const entry of moodsResponse.data) {
      const moodDetails = await axios.get(
        `https://suivi-humeurs-funes.onrender.com/api/humeurs/${entry.humeurId}`,
      );

      const dayIndex = new Date(entry.date).getDay();

      if (entry.timeOfDay === "morning") {
        morningData.value[dayIndex] = moodDetails.data;
      } else {
        eveningData.value[dayIndex] = moodDetails.data;
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
  } finally {
    isLoading.value = false;
  }
};

// Fonction de partage
const shareMood = (period) => {
  let shareText = "";
  let shareUrl = window.location.href;

  if (period === "daily") {
    shareText = `Mon humeur du jour : ${morningData.value[selectedDate.value.getDay()]?.title || 'Aucune humeur'}`;
  } else if (period === "weekly") {
    shareText = "Voici mes humeurs de la semaine!";
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  // Ouvrir les liens de partage dans un nouvel onglet
  window.open(twitterUrl, "_blank");
  window.open(facebookUrl, "_blank");
};

// Initialisation
onMounted(fetchMoodData);
</script>

<style scoped>
/* Variables */
:root {
  --primary-color: #4caf50;
  --secondary-color: #2c1810;
  --background-color: #f4e4bc;
  --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

/* Page Layout */
.mood-tracking-page {
  min-height: 100vh;
  background-color: var(--background-color);
  padding: 40px 20px;
}

/* Header Styles */
.tracking-header {
  text-align: center;
  margin-bottom: 40px;
}

.tracking-header h1 {
  font-family: "Sora", sans-serif;
  color: var(--secondary-color);
  font-size: 2.5rem;
  margin-bottom: 20px;
}

/* View Toggle */
.view-toggle {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 30px;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 50px;
  background: white;
  color: var(--secondary-color);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.toggle-btn.active {
  background: #46a34a;
  color: white;
}

.toggle-btn i {
  font-size: 1.1rem;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

/* Mood Cards */
.moods-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.mood-card {
  background: linear-gradient(135deg, #f1f1f1, #e0e0e0); /* Fond dégradé */
  border-radius: 16px;
  box-shadow: var(--card-shadow);
  padding: 24px;
  overflow: hidden;
  transition: var(--transition);
  position: relative;
}

.mood-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.mood-card .time-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1.2rem;
}

.mood-card .mood-content {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
}

.mood-card .mood-image-container {
  flex-shrink: 0;
}

.mood-card .mood-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.mood-card .mood-details h3 {
  font-size: 1.3rem;
}

.mood-card .mood-details p {
  font-size: 1rem;
  color: #555;
}

.mood-card .mood-empty {
  text-align: center;
}

.mood-card .mood-empty i {
  font-size: 2rem;
  color: #999;
}

/* Share Button */
.share-button {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.share-button button {
  background: var(--primary-color);
  color: white;
  padding: 10px 30px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  transition: var(--transition);
}

.share-button button:hover {
  background: #388e3c;
}

/* Week View */
.weekly-view .week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 16px;
}

.weekly-view .day-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 16px;
  text-align: center;
  transition: var(--transition);
}

.weekly-view .day-card.current-day {
  border: 2px solid var(--primary-color);
}

.weekly-view .day-header h3 {
  font-size: 1.1rem;
  color: var(--secondary-color);
}

.weekly-view .mini-mood {
  margin-top: 8px;
}

.weekly-view .mini-mood .time-indicator {
  font-weight: bold;
  color: #666;
  font-size: 0.9rem;
}

.weekly-view .mini-mood-content img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.weekly-view .mini-mood-empty i {
  font-size: 1.2rem;
  color: #bbb;
}
</style>
