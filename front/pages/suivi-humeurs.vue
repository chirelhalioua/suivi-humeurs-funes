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
                <div
                  v-if="morningData[date.getDay()]"
                  class="mini-mood-content"
                >
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
                <div
                  v-if="eveningData[date.getDay()]"
                  class="mini-mood-content"
                >
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
      </div>
    </div>

    <div v-if="canShareWeek" class="share-button-container">
      <div class="share-btn" @click="toggleSocials">
        Partager ma semaine
        <div class="social-icons" v-if="socialsVisible">
          <a :href="facebookShareLink" target="_blank">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a :href="twitterShareLink" target="_blank">
            <i class="fab fa-twitter"></i>
          </a>
          <a :href="linkedinShareLink" target="_blank">
            <i class="fab fa-linkedin-in"></i>
          </a>
          <a :href="whatsappShareLink" target="_blank">
            <i class="fab fa-whatsapp"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const view = ref("daily");
const selectedDate = ref(new Date());
const isLoading = ref(true);
const morningData = ref([]);
const eveningData = ref([]);
const socialsVisible = ref(false);
const canShareWeek = ref(false);

const days = [
  "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"
];

const formatDate = (date) => {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(date);
};

const formatDateShort = (date) => {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "numeric" }).format(date);
};

const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const previousDay = () => {
  selectedDate.value = new Date(selectedDate.value.setDate(selectedDate.value.getDate() - 1));
};

const nextDay = () => {
  if (!isToday(selectedDate.value)) {
    selectedDate.value = new Date(selectedDate.value.setDate(selectedDate.value.getDate() + 1));
  }
};

const changeView = (newView) => {
  view.value = newView;
};

const fetchMoodData = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    console.error("ID utilisateur non trouvé");
    return;
  }
  try {
    isLoading.value = true;
    const moodsResponse = await axios.get(`https://suivi-humeurs-funes.onrender.com/api/humeurs_utilisateurs/${userId}`);
    morningData.value = Array(7).fill(null);
    eveningData.value = Array(7).fill(null);
    for (const entry of moodsResponse.data) {
      const moodDetails = await axios.get(`https://suivi-humeurs-funes.onrender.com/api/humeurs/${entry.humeurId}`);
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
    canShareWeek.value = morningData.value.every(mood => mood !== null) && eveningData.value.every(mood => mood !== null);
  }
};

const weekDates = computed(() => {
  const startOfWeek = new Date(selectedDate.value);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });
});

const toggleSocials = () => {
  socialsVisible.value = !socialsVisible.value;
};

const shareText = computed(() => {
  const date = formatDate(selectedDate.value);
  const moodMorning = morningData.value[selectedDate.value.getDay()];
  const moodEvening = eveningData.value[selectedDate.value.getDay()];

  let shareText = `📅 ${date} - Mon humeur :\n`;
  shareText += moodMorning ? `🌞 Matin : ${moodMorning.title}\n` : "🌞 Matin : Pas d'humeur enregistrée\n";
  shareText += moodEvening ? `🌙 Soir : ${moodEvening.title}\n` : "🌙 Soir : Pas d'humeur enregistrée\n";
  
  return shareText;
});

const facebookShareLink = computed(() => {
  const text = encodeURIComponent(shareText.value);
  return `https://www.facebook.com/sharer/sharer.php?u=https://suivi-humeurs-funes.vercel.app&quote=${text}`;
});

const twitterShareLink = computed(() => {
  const text = encodeURIComponent(shareText.value);
  return `https://twitter.com/intent/tweet?text=${text}&url=https://suivi-humeurs-funes.vercel.app/`;
});

const linkedinShareLink = computed(() => {
  const text = encodeURIComponent(shareText.value);
  return `https://www.linkedin.com/shareArticle?mini=true&url=https://suivi-humeurs-funes.vercel.app/&title=Partager mon humeur&summary=${text}`;
});

const whatsappShareLink = computed(() => {
  const text = encodeURIComponent(shareText.value);
  return `https://wa.me/?text=${text}`;
});

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
  background: #46A34A;
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

/* Daily View */
.daily-view {
  max-width: 1000px;
  margin: 0 auto;
}

.date-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.current-date {
  text-align: center;
}

.current-date h2 {
  font-size: 1.5rem;
  color: var(--secondary-color);
  margin-bottom: 4px;
}

.current-date p {
  color: #666;
}

.nav-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--secondary-color);
  cursor: pointer;
  padding: 8px;
  transition: var(--transition);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  padding: 20px;
  box-shadow: var(--card-shadow);
}

.time-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  margin-bottom: 20px;
  color: var(--secondary-color);
}

.mood-content {
  text-align: center;
}

.mood-image-container {
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
}

.mood-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.mood-image:hover {
  transform: scale(1.1);
}

.mood-details h3 {
  font-size: 1.2rem;
  color: var(--secondary-color);
  margin-bottom: 8px;
}

.mood-details p {
  color: #666;
}

.mood-empty {
  text-align: center;
  padding: 40px;
  color: #666;
}

.mood-empty i {
  font-size: 2rem;
  margin-bottom: 12px;
}

/* Weekly View */
.week-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.day-card {
  background: linear-gradient(135deg, #f1f1f1, #e0e0e0); /* Fond dégradé */
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--card-shadow);
}

.day-card.current-day {
  border: 2px solid var(--primary-color);
}

.day-header {
  text-align: center;
  margin-bottom: 16px;
}

.day-header h3 {
  font-size: 1.1rem;
  color: var(--secondary-color);
  margin-bottom: 4px;
}

.day-header p {
  color: #666;
  font-size: 0.9rem;
}

.day-moods {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mini-mood {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-indicator {
  font-size: 0.9rem;
  color: #666;
  width: 50px;
}

.mini-mood-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mini-mood-content img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.mini-mood-content span {
  font-size: 0.9rem;
  color: var(--secondary-color);
}

.mini-mood-empty {
  color: #ccc;
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Media Queries */
@media (max-width: 768px) {
  .tracking-header h1 {
    font-size: 2rem;
  }

  .moods-container {
    grid-template-columns: 1fr;
  }

  .week-grid {
    grid-template-columns: 1fr;
  }
}

.share-btn {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  margin-top: 15px;
  width: 100%;
  cursor: pointer;
  font-size: 14px;
  text-align: center;
}

.share-btn:hover {
  background-color: #0056b3;
}
  
.mini-mood .share-btn {
  margin-top: 10px;
  padding: 5px;
  width: 100%;
}
  
/* Style pour l'élément de partage de la semaine */
.share-button-container {
  margin-top: 30px;
  text-align: center;
}

.share-btn {
  font-size: 18px;
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.share-btn:hover {
  background-color: #0056b3;
}

/* Icônes sociales */
.social-icons {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-icons a {
  font-size: 20px;
  color: #333;
  text-decoration: none;
}

.social-icons a:hover {
  color: #007bff;
}
</style>

