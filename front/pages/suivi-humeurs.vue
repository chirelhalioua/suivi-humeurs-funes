<template>
  <div class="mood-tracking-page">
    <div class="tracking-header">
      <h1>Suivi des Humeurs</h1>
      
      <!-- Navigation entre les jours -->
      <div class="date-selector">
        <button class="nav-btn" @click="previousDay">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h2>{{ formatDate(selectedDate) }}</h2>
        <button class="nav-btn" @click="nextDay" :disabled="isToday(selectedDate)">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <!-- Boutons de bascule (Journalier / Hebdomadaire) -->
      <div class="view-toggle">
        <button :class="['toggle-btn', { active: view === 'daily' }]" @click="changeView('daily')">
          <i class="fas fa-calendar-day"></i> Journalier
        </button>
        <button :class="['toggle-btn', { active: view === 'weekly' }]" @click="changeView('weekly')">
          <i class="fas fa-calendar-week"></i> Hebdomadaire
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement de vos humeurs...</p>
    </div>

    <div v-else>
      <!-- Mode Journalier -->
      <div v-if="view === 'daily'" class="daily-view">
        <div class="mood-column">
          <div class="mood-card">
            <h3><i class="fas fa-sun morning-icon"></i> Matin (6h - 13h)</h3>
            <p v-if="dailyMoods.morning">{{ dailyMoods.morning.title }}</p>
            <p v-else>Pas d'humeur enregistrée</p>
          </div>
          <div class="mood-card">
            <h3><i class="fas fa-moon evening-icon"></i> Soir (17h - Minuit)</h3>
            <p v-if="dailyMoods.evening">{{ dailyMoods.evening.title }}</p>
            <p v-else>Pas d'humeur enregistrée</p>
          </div>
        </div>
      </div>

      <!-- Mode Hebdomadaire -->
      <div v-if="view === 'weekly'" class="weekly-view">
        <div class="week-row">
          <div v-for="day in fullWeek" :key="day.date" class="week-day">
            <h3>{{ formatDate(new Date(day.date)) }}</h3>
            <div class="mood-card">
              <i class="fas fa-sun morning-icon"></i>
              <p v-if="day.morning">Matin : {{ day.morning.title }}</p>
              <p v-else>Matin : Pas d'humeur enregistrée</p>
            </div>
            <div class="mood-card">
              <i class="fas fa-moon evening-icon"></i>
              <p v-if="day.evening">Soir : {{ day.evening.title }}</p>
              <p v-else>Soir : Pas d'humeur enregistrée</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

// Vue par défaut
const view = ref('daily');
const selectedDate = ref(new Date('2025-03-09')); // Début au 9 mars 2025
const isLoading = ref(true);
const dailyMoods = ref({ morning: null, evening: null });
const fullWeek = ref([]);

// Vérifier la présence de l'ID utilisateur
const userId = localStorage.getItem('userId') || null;

const fetchMoods = async () => {
  if (!userId) {
    console.error('ID utilisateur non trouvé');
    return;
  }

  try {
    isLoading.value = true;
    const response = await axios.get(`https://suivi-humeurs-funes.onrender.com/api/humeurs_utilisateurs/${userId}`);
    const today = selectedDate.value.toISOString().split('T')[0];
    dailyMoods.value = response.data.find(entry => entry.date === today) || { morning: null, evening: null };
    fetchWeeklyMoods(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des humeurs:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchWeeklyMoods = (data) => {
  const startOfWeek = new Date(selectedDate.value);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    const formattedDate = day.toISOString().split('T')[0];
    const mood = data.find(entry => entry.date === formattedDate) || { date: formattedDate, morning: null, evening: null };
    week.push(mood);
  }
  fullWeek.value = week;
};

const formatDate = date => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
const isToday = date => date.toDateString() === new Date().toDateString();

const previousDay = () => selectedDate.value = new Date(selectedDate.value.setDate(selectedDate.value.getDate() - 1));
const nextDay = () => selectedDate.value = new Date(selectedDate.value.setDate(selectedDate.value.getDate() + 1));

const changeView = newView => (view.value = newView);

watch(selectedDate, fetchMoods);
onMounted(fetchMoods);
</script>

<style scoped>
.mood-tracking-page {
  padding: 20px;
  background: #f4e4bc;
}
.tracking-header {
  text-align: center;
}
.view-toggle button {
  margin: 5px;
  padding: 10px 20px;
  background: white;
  border: none;
  border-radius: 20px;
}
.view-toggle .active {
  background: #4caf50;
  color: white;
}
.date-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.loading-state {
  text-align: center;
}
.week-row {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}
.week-day {
  background: white;
  padding: 10px;
  margin: 5px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 120px;
}
.mood-column {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.mood-card {
  background: white;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}
.mood-entry {
  display: flex;
  align-items: center;
}
.morning-icon {
  color: #ffd700;
  margin-right: 5px;
}
.evening-icon {
  color: #8a2be2;
  margin-right: 5px;
}
</style>
