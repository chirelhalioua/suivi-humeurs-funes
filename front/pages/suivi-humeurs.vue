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
      </div>

      <!-- Vue Hebdomadaire -->
      <div v-if="view === 'weekly'" class="weekly-view">
        <div class="week-container">
          <div
            v-for="(date, index) in weekDates"
            :key="index"
            class="week-day"
          >
            <div class="date-info">
              <h3>{{ formatDateShort(date) }}</h3>
              <p>{{ days[date.getDay()] }}</p>
            </div>

            <!-- Humeur du Matin -->
            <div class="mood-card morning">
              <div v-if="morningData[index]" class="mood-content">
                <div class="mood-image-container">
                  <img
                    :src="morningData[index].image"
                    :alt="morningData[index].title"
                    class="mood-image"
                  />
                </div>
                <div class="mood-details">
                  <h3>{{ morningData[index].title }}</h3>
                  <p>{{ morningData[index].subtitle }}</p>
                </div>
              </div>
              <div v-else class="mood-empty">
                <i class="fas fa-cloud"></i>
                <p>Pas d'humeur enregistrée</p>
              </div>
            </div>

            <!-- Humeur du Soir -->
            <div class="mood-card evening">
              <div v-if="eveningData[index]" class="mood-content">
                <div class="mood-image-container">
                  <img
                    :src="eveningData[index].image"
                    :alt="eveningData[index].title"
                    class="mood-image"
                  />
                </div>
                <div class="mood-details">
                  <h3>{{ eveningData[index].title }}</h3>
                  <p>{{ eveningData[index].subtitle }}</p>
                </div>
              </div>
              <div v-else class="mood-empty">
                <i class="fas fa-cloud"></i>
                <p>Pas d'humeur enregistrée</p>
              </div>
            </div>
          </div>
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

// Récupérer les données d'humeur
const fetchMoodData = async () => {
  try {
    const token = localStorage.getItem("authToken");  // Exemple avec localStorage

    // Récupérer l'ID utilisateur
    const userResponse = await axios.get("https://suivi-humeurs-funes.onrender.com/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

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

// Initialisation
onMounted(fetchMoodData);
</script>

<style scoped>
/* Variables */
:root {
  --primary-color: #4caf50;
  --secondary-color: #2c1810;
  --background-color: #f4e4bc;
  --card-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

/* Page Layout */
.mood-tracking-page {
  min-height: 100vh;
  background-color: var(--background-color);
  padding: 20px 10px; /* Réduction du padding */
}

/* Header Styles */
.tracking-header {
  text-align: center;
  margin-bottom: 20px; /* Moins de marge */
}

.tracking-header h1 {
  font-size: 2rem; /* Taille de texte réduite */
  margin-bottom: 10px;
}

/* View Toggle */
.view-toggle {
  display: flex;
  gap: 10px; /* Moins d'espace entre les boutons */
  justify-content: center;
}

.toggle-btn {
  padding: 8px 16px; /* Boutons plus compacts */
  border-radius: 25px;
}

/* Daily View */
.daily-view {
  max-width: 800px;
  margin: 0 auto;
}

.date-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.current-date h2 {
  font-size: 1.2rem;
}

.moods-container {
  display: flex;
  gap: 10px;
}

.mood-card {
  background: white;
  border-radius: 15px;
  padding: 16px;
  box-shadow: var(--card-shadow);
}

.mood-image-container {
  width: 100px;
  height: 100px;
}

.mood-details h3 {
  font-size: 1rem;
}
</style>
