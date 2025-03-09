<template>
  <div class="suivi-humeurs">
    <h1>📅 Suivi des Humeurs</h1>

    <!-- Affichage quotidien -->
    <section class="daily-tracking">
      <h2>📝 Suivi Quotidien</h2>
      <ul>
        <li v-for="mood in dailyMoods" :key="mood._id" class="mood-item">
          <strong>{{ formatDate(mood.date) }}</strong> - {{ mood.humeur.title }}
          <p>{{ mood.description }}</p>
        </li>
      </ul>
    </section>

    <!-- Affichage hebdomadaire -->
    <section class="weekly-tracking">
      <h2>📆 Suivi Hebdomadaire</h2>
      <div class="calendar">
        <div v-for="day in weeklyMoods" :key="day.date" class="calendar-day">
          <div class="date">{{ formatDate(day.date) }}</div>
          <div v-if="day.mood" class="mood">
            <img :src="day.mood.image" :alt="day.mood.title" class="mood-image" />
            <p>{{ day.mood.title }}</p>
          </div>
          <div v-else class="no-mood">😶 Aucune humeur</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const userId = localStorage.getItem('userId');
const dailyMoods = ref([]);
const weeklyMoods = ref([]);

const fetchMoods = async () => {
  try {
    const response = await axios.get(`https://suivi-humeurs-funes.onrender.com/api/humeurs_utilisateurs?userId=${userId}`);
    const moods = response.data;
    
    // Trier les humeurs par date (du plus récent au plus ancien)
    dailyMoods.value = moods.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Récupérer les humeurs des 7 derniers jours
    const last7Days = getLast7Days();
    weeklyMoods.value = last7Days.map(date => ({
      date,
      mood: moods.find(m => m.date === date) || null
    }));
  } catch (error) {
    console.error("Erreur lors du chargement des humeurs", error);
  }
};

const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });
};

onMounted(() => {
  fetchMoods();
});
</script>

<style scoped>
.suivi-humeurs {
  text-align: center;
  max-width: 900px;
  margin: auto;
}

h1, h2 {
  color: #4CAF50;
}

.daily-tracking ul {
  list-style: none;
  padding: 0;
}

.mood-item {
  background: #f9f9f9;
  border-left: 5px solid #4CAF50;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
}

.calendar {
  display: flex;
  justify-content: space-between;
  overflow-x: auto;
  padding: 10px;
}

.calendar-day {
  flex: 1;
  min-width: 120px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.mood-image {
  width: 50px;
  height: 50px;
}

.no-mood {
  color: #aaa;
}
</style>
