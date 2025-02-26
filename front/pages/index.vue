<template>
  <div>
    <!-- Hero Section -->
    <section ref="heroSection" class="hero">
      <h1>Bienvenue sur notre plateforme</h1>
      <p>Rejoignez-nous pour suivre votre humeur.</p>
      <button @click="goToRegister" :disabled="isNavigating">
        {{ isNavigating ? "Chargement..." : "S'inscrire" }}
      </button>
    </section>

    <!-- Concept Section -->
    <section ref="conceptSection" class="concept">
      <h2>Notre Concept</h2>
      <p>Nous vous aidons à suivre votre humeur au quotidien.</p>
    </section>

    <!-- Mood Section -->
    <section ref="moodSection" class="moods">
      <h2>Les Humeurs</h2>
      <div v-if="loading">Chargement des humeurs...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="mood-list" :class="{ visible: isMoodVisible }">
        <div v-for="mood in moods" :key="mood.id" class="mood-item">
          <img :src="mood.imageUrl" :alt="mood.title" />
          <p>{{ mood.title }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

// Références pour observer les sections
const heroSection = ref(null);
const conceptSection = ref(null);
const moodSection = ref(null);

// Données des humeurs
const moods = ref([]);
const loading = ref(true);
const error = ref(null);
const isMoodVisible = ref(false);
const isNavigating = ref(false);

const router = useRouter();

// Fonction pour récupérer les humeurs
const fetchMoods = async () => {
  try {
    const response = await fetch("https://suivi-humeurs-back.onrender.com/api/humeurs");
    if (!response.ok) throw new Error("Erreur lors du chargement des humeurs");
    moods.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Fonction de navigation avec gestion d'état
const goToRegister = async () => {
  isNavigating.value = true;
  try {
    await router.push("/register");
  } catch (err) {
    console.error("Erreur de navigation :", err);
  } finally {
    isNavigating.value = false;
  }
};

// Détecter quand la section des humeurs est visible
const setupObserver = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        isMoodVisible.value = true;
        observer.disconnect();
      }
    },
    { threshold: 0.3 }
  );
  if (moodSection.value) observer.observe(moodSection.value);
};

onMounted(() => {
  fetchMoods();
  setupObserver();
});
</script>

<style scoped>
/* Styles de base */
.hero, .concept, .moods {
  padding: 50px;
  text-align: center;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.3s;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.mood-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.mood-list.visible {
  opacity: 1;
}

.mood-item {
  width: 150px;
  text-align: center;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
