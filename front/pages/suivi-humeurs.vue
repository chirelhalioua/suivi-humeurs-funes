<template>
  <div class="mood-tracking-page">
    <div class="tracking-header">
      <h1>Suivi des Humeurs</h1>
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
      <div v-if="view === 'daily'" class="daily-view">
        <div class="date-selector">
          <button class="nav-btn" @click="previousDay">
            <i class="fas fa-chevron-left"></i>
          </button>
          <h2>{{ formatDate(selectedDate) }}</h2>
          <button class="nav-btn" @click="nextDay" :disabled="isToday(selectedDate)">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        <div class="mood-card" v-for="(mood, time) in dailyMoods" :key="time">
          <h3>{{ time === 'morning' ? 'Matin' : 'Soir' }}</h3>
          <p v-if="mood">{{ mood.title }}</p>
          <p v-else>Pas d'humeur enregistrée</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const view = ref('daily');
const selectedDate = ref(new Date());
const isLoading = ref(true);
const dailyMoods = ref({ morning: null, evening: null });

const userId = localStorage.getItem('userId');

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
  } catch (error) {
    console.error('Erreur lors de la récupération des humeurs:', error);
  } finally {
    isLoading.value = false;
  }
};

const formatDate = date => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
const isToday = date => date.toDateString() === new Date().toDateString();
const previousDay = () => selectedDate.value.setDate(selectedDate.value.getDate() - 1);
const nextDay = () => selectedDate.value.setDate(selectedDate.value.getDate() + 1);
const changeView = newView => (view.value = newView);

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
.loading-state {
  text-align: center;
}
.mood-card {
  background: white;
  margin: 10px 0;
  padding: 20px;
  border-radius: 12px;
}
.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
