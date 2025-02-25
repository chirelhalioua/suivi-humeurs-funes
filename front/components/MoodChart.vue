<template>
  <div>
    <!-- Boutons pour changer la vue -->
    <div>
      <button @click="changeView('daily')">Journalier</button>
      <button @click="changeView('weekly')">Hebdomadaire</button>
    </div>

    <!-- Sélection du jour pour l'affichage journalier -->
    <div v-if="view === 'daily'" style="margin-top: 10px;">
      <label for="daySelect">Choisir un jour :</label>
      <select id="daySelect" v-model="selectedDay" @change="updateChart">
        <option v-for="(day, index) in days" :key="index" :value="index">{{ day }}</option>
      </select>
    </div>

    <!-- Canvas pour le graphique -->
    <canvas id="moodChart" width="400" height="200"></canvas>

    <!-- Message si une humeur n'est pas encore choisie -->
    <p v-if="missingMorningMood">Humeur du matin pas encore choisie.</p>
    <p v-if="missingEveningMood">Humeur du soir pas encore choisie.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

const view = ref('daily');
const selectedDay = ref(0);
const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const morningData = ref([]);
const eveningData = ref([]);
const missingMorningMood = ref(false);
const missingEveningMood = ref(false);

// Fonction pour récupérer l'utilisateur connecté à partir du token
const getUserDataFromToken = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error('Aucun token trouvé. Veuillez vous reconnecter.');
    return null;
  }

  try {
    // Requête au backend pour récupérer les données utilisateur
    const response = await axios.get('http://localhost:5000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`, // En-tête Authorization avec le token
      },
    });
    return response.data; // Retourne les informations utilisateur
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur :', error);
    return null;
  }
};

// Fonction pour récupérer les humeurs
const fetchMoodData = async () => {
  const user = await getUserDataFromToken(); // Récupère les infos utilisateur depuis le token

  if (!user) {
    console.error('Impossible de récupérer les données utilisateur.');
    return;
  }

  try {
    const response = await axios.get(`http://localhost:5000/api/humeurs_utilisateurs/${user._id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Ajout du token dans l'en-tête
      },
    });

    // Initialisation des données
    morningData.value = Array(7).fill(null);
    eveningData.value = Array(7).fill(null);
    missingMorningMood.value = false;
    missingEveningMood.value = false;

    response.data.forEach((entry) => {
      const dayIndex = new Date(entry.date).getDay();
      if (entry.timeOfDay === 'morning') {
        morningData.value[dayIndex] = entry.description; // Stocke l'humeur (texte)
      } else if (entry.timeOfDay === 'evening') {
        eveningData.value[dayIndex] = entry.description; // Stocke l'humeur (texte)
      }
    });

    // Vérifier si une humeur est manquante pour la journée sélectionnée
    if (!morningData.value[selectedDay.value]) {
      missingMorningMood.value = true;
    }
    if (!eveningData.value[selectedDay.value]) {
      missingEveningMood.value = true;
    }

    updateChart(); // Met à jour le graphique
  } catch (error) {
    console.error('Erreur lors de la récupération des humeurs :', error);
  }
};

// Fonction pour mettre à jour le graphique
const updateChart = () => {
  const ctx = document.getElementById('moodChart').getContext('2d');
  if (window.myChart) {
    window.myChart.destroy();
  }

  const labels = [days[selectedDay.value]];
  const datasets = [];

  // Ajouter l'humeur du matin (texte) si présente
  if (morningData.value[selectedDay.value]) {
    datasets.push({
      label: 'Humeur du matin',
      data: [morningData.value[selectedDay.value]],
      borderColor: 'rgba(75, 192, 192, 1)', // Couleur du matin
      fill: false,
    });
  }

  // Ajouter l'humeur du soir (texte) si présente
  if (eveningData.value[selectedDay.value]) {
    datasets.push({
      label: 'Humeur du soir',
      data: [eveningData.value[selectedDay.value]],
      borderColor: 'rgba(153, 102, 255, 1)', // Couleur du soir
      fill: false,
    });
  }

  // Création du graphique
  window.myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets,
    },
  });
};

// Fonction pour changer la vue (Journalier/Hebdomadaire)
const changeView = (viewType) => {
  view.value = viewType;
  if (viewType === 'daily') {
    fetchMoodData();
  }
};

onMounted(() => {
  fetchMoodData(); // Récupérer les données initiales dès le montage
});

watch(selectedDay, () => {
  updateChart(); // Mettre à jour le graphique chaque fois que selectedDay change
});
</script>

<style scoped>
button {
  margin: 10px;
  padding: 10px;
  cursor: pointer;
}

label {
  margin-right: 15px;
}

select {
  margin-left: 10px;
  padding: 5px;
}

p {
  color: red;
  font-weight: bold;
}
</style>
