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

        <!-- Bouton de partage quotidien -->
        <div v-if="canShareDay" class="share-button-container">
          <div class="share-btn" @click="toggleSocials">
            Partager mon humeur
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

    <!-- Bouton de partage hebdomadaire -->
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

<script>
export default {
  data() {
    return {
      view: 'daily', // Vue par défaut : 'daily' ou 'weekly'
      selectedDate: new Date(), // Date sélectionnée pour le suivi des humeurs
      isLoading: false,
      morningData: {}, // Données d'humeur du matin (en fonction des jours)
      eveningData: {}, // Données d'humeur du soir (en fonction des jours)
      socialsVisible: false, // Afficher ou masquer les boutons de partage
    };
  },
  computed: {
    days() {
      return [
        'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
      ];
    },
    weekDates() {
      const startOfWeek = this.getStartOfWeek(this.selectedDate);
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
      });
    },
    canShareDay() {
      return this.morningData[this.selectedDate.getDay()] || this.eveningData[this.selectedDate.getDay()];
    },
    canShareWeek() {
      return this.weekDates.some(date => {
        return (
          this.morningData[date.getDay()] || this.eveningData[date.getDay()]
        );
      });
    },
    facebookShareLink() {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.currentShareUrl)}`;
    },
    twitterShareLink() {
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.currentShareUrl)}`;
    },
    linkedinShareLink() {
      return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(this.currentShareUrl)}`;
    },
    whatsappShareLink() {
      return `https://api.whatsapp.com/send?text=${encodeURIComponent(this.currentShareUrl)}`;
    },
    currentShareUrl() {
      return this.view === 'daily'
        ? `http://example.com/share/daily/${this.formatDate(this.selectedDate)}`
        : `http://example.com/share/weekly/${this.formatDate(this.selectedDate)}`;
    },
  },
  methods: {
    // Format les dates
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('fr-FR', options);
    },
    formatDateShort(date) {
      const options = { day: '2-digit', month: 'short' };
      return date.toLocaleDateString('fr-FR', options);
    },
    getStartOfWeek(date) {
      const day = date.getDay(),
            diff = date.getDate() - day + (day == 0 ? -6 : 1); // Ajuste pour commencer la semaine le Lundi
      return new Date(date.setDate(diff));
    },
    changeView(view) {
      this.view = view;
    },
    previousDay() {
      this.selectedDate.setDate(this.selectedDate.getDate() - 1);
    },
    nextDay() {
      this.selectedDate.setDate(this.selectedDate.getDate() + 1);
    },
    isToday(date) {
      const today = new Date();
      return (
        today.getDate() === date.getDate() &&
        today.getMonth() === date.getMonth() &&
        today.getFullYear() === date.getFullYear()
      );
    },
    toggleSocials() {
      this.socialsVisible = !this.socialsVisible;
    },
  },
  watch: {
    selectedDate(newDate) {
      this.isLoading = true;
      this.fetchMoodData(newDate).finally(() => {
        this.isLoading = false;
      });
    },
  },
  mounted() {
    this.fetchMoodData(this.selectedDate);
  },
  methods: {
    // Fonction pour récupérer les données d'humeur (en vrai, vous utiliseriez une API pour ça)
    fetchMoodData(date) {
      // Exemple de données fictives
      const weekData = [
        { title: "Heureux", subtitle: "Bien réveillé", image: "/assets/happy-morning.png" },
        { title: "Fatigué", subtitle: "Encore un peu de sommeil", image: "/assets/tired-morning.png" },
        // ... Ajouter des données pour chaque jour de la semaine
      ];

      this.morningData = {
        0: weekData[0], // Dimanche matin
        1: weekData[1], // Lundi matin
        // ... Ajoutez d'autres jours ici
      };
      this.eveningData = {
        0: weekData[1], // Dimanche soir
        1: weekData[0], // Lundi soir
        // ... Ajoutez d'autres jours ici
      };
    },
  },
};
</script>

<style scoped>
  .mood-tracking-page {
  font-family: 'Roboto', sans-serif;
  background-color: #f9f9f9;
  padding: 20px;
}

.tracking-header {
  text-align: center;
  margin-bottom: 20px;
}

.view-toggle {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.toggle-btn {
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  background-color: #ffffff;
  border: 2px solid #ccc;
  border-radius: 5px;
  transition: 0.3s;
}

.toggle-btn.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.moods-container {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

.mood-card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 48%;
}

.mood-card .time-label {
  font-size: 18px;
  margin-bottom: 10px;
}

.mood-image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 15px;
}

.mood-image {
  width: 100%;
  height: auto;
}

.mood-details {
  text-align: center;
}

.mood-empty {
  text-align: center;
  color: #aaa;
}

.share-button-container {
  margin-top: 20px;
  text-align: center;
}

.share-btn {
  cursor: pointer;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  font-size: 16px;
  display: inline-block;
  transition: 0.3s;
}

.share-btn:hover {
  background-color: #0056b3;
}

.social-icons {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.social-icons a {
  font-size: 20px;
  color: #007bff;
  text-decoration: none;
  transition: 0.3s;
}

.social-icons a:hover {
  color: #0056b3;
}

.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 15px;
}

.day-card {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.day-header {
  text-align: center;
  margin-bottom: 15px;
}

.mini-mood {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.mini-mood-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #aaa;
}

.mini-mood-content {
  display: flex;
  gap: 10px;
  align-items: center;
}

.current-day {
  background-color: #007bff;
  color: white;
}
</style>
