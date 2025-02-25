<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section" ref="heroSection">
      <div class="hero-content">
        <h1 class="hero-title">Suis tes humeurs avec Louis de Funès</h1>
        <p class="hero-description">
          Exprimez vos émotions à travers les expressions légendaires de Louis
          de Funès
        </p>
        <button
          class="cta-button"
          @click="goToRegister"
          :disabled="isNavigating"
        >
          <span class="button-text">{{
            isNavigating ? "Chargement..." : "Commencer l'aventure"
          }}</span>
          <span class="button-icon">→</span>
        </button>
      </div>
      <div class="scroll-indicator">
        <div class="mouse">
          <div class="wheel"></div>
        </div>
        <div class="arrow"></div>
      </div>
    </section>

    <!-- Concept Section -->
    <section class="concept-section" ref="conceptSection">
      <div class="section-header" :class="{ visible: isConceptVisible }">
        <h2 class="section-title">Le Concept</h2>
        <p class="section-subtitle">Exprimez vos humeurs avec Louis de Funès</p>
      </div>

      <div class="concept-grid">
        <div
          v-for="(concept, index) in concepts"
          :key="index"
          class="concept-card"
          :class="{ visible: isConceptVisible }"
          :style="{ '--delay': `${index * 0.1}s` }"
        >
          <div class="concept-icon">{{ concept.icon }}</div>
          <div class="concept-content">
            <span class="concept-number">0{{ index + 1 }}</span>
            <h3 class="concept-title">{{ concept.title }}</h3>
            <p class="concept-description">{{ concept.description }}</p>
          </div>
          <div class="concept-hover-effect"></div>
        </div>
      </div>
    </section>

    <!-- Mood Preview Section -->
    <section class="mood-section" ref="moodSection">
      <div class="section-header" :class="{ visible: isMoodVisible }">
        <h2 class="section-title">Aperçu des Humeurs</h2>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <p>Chargement des humeurs...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="error-state">
        <div class="error-icon">!</div>
        <p>{{ errorMessage }}</p>
        <button @click="fetchMoods" class="retry-button">Réessayer</button>
      </div>

      <!-- Moods Grid -->
      <div v-else class="mood-grid" :class="{ visible: isMoodVisible }">
        <div
          v-for="(mood, index) in moods"
          :key="mood._id"
          class="mood-card"
          :style="{ '--delay': `${index * 0.1}s` }"
        >
          <div class="mood-image-wrapper">
            <div class="image-placeholder" v-if="!mood.imageLoaded"></div>
            <img
              :src="mood.image"
              :alt="mood.title"
              class="mood-image"
              :class="{ loaded: mood.imageLoaded }"
              @load="mood.imageLoaded = true"
            />
          </div>
          <div class="mood-content">
            <h3 class="mood-title">{{ mood.title }}</h3>
            <p class="mood-subtitle">{{ mood.subtitle }}</p>
            <p class="mood-film">
              <span class="film-label">Film :</span>
              {{ mood.film }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// State
const isNavigating = ref(false);
const isLoading = ref(true);
const errorMessage = ref("");
const moods = ref([]);

// Intersection Observer refs
const conceptSection = ref(null);
const moodSection = ref(null);
const isConceptVisible = ref(false);
const isMoodVisible = ref(false);

// Concepts data
const concepts = [
  {
    title: "Exprimez-vous",
    description:
      "Exprimez facilement votre humeur à travers des images de Louis de Funès",
    icon: "🎭",
  },
  {
    title: "Suivez",
    description: "Suivez votre humeur de façon journalière et hebdomadaire",
    icon: "📊",
  },
  {
    title: "Améliorez",
    description: "Améliorez votre humeur grâce à des vidéos et citations",
    icon: "⭐",
  },
  {
    title: "Partagez",
    description: "Partagez votre humeur avec votre entourage",
    icon: "🤝",
  },
];

// Intersection Observer setup
const createObserver = (element, callback) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(true);
        }
      });
    },
    { threshold: 0.2 },
  );

  if (element.value) {
    observer.observe(element.value);
  }

  return observer;
};

// API calls
const fetchMoods = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    const response = await fetch(
      'https://suivi-humeurs-back.onrender.com/api/humeurs',
    );
    if (!response.ok) throw new Error("Impossible de récupérer les humeurs");

    const data = await response.json();
    moods.value = data.slice(0, 4).map((mood) => ({
      ...mood,
      imageLoaded: false,
    }));
  } catch (error) {
    errorMessage.value =
      "Une erreur est survenue lors du chargement des humeurs.";
  } finally {
    isLoading.value = false;
  }
};

// Navigation
const goToRegister = async () => {
  isNavigating.value = true;
  try {
    await navigateTo("/register");
  } finally {
    isNavigating.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchMoods();

  const observers = [
    createObserver(
      conceptSection,
      (visible) => (isConceptVisible.value = visible),
    ),
    createObserver(moodSection, (visible) => (isMoodVisible.value = visible)),
  ];

  onUnmounted(() => {
    observers.forEach((observer) => observer?.disconnect());
  });
});
</script>

<style scoped>
/* Variables CSS */
:root {
  --primary-color: #4caf50;
  --primary-dark: #45a049;
  --text-color: #2c1810;
  --background-color: #f4e4bc;
  --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition-timing: 300ms;
}

/* Base styles */
.home-page {
  background-color: var(--background-color);
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("/background.jpg");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: white;
  overflow: hidden;
}

.hero-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 0 20px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease forwards;
}

.hero-description {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease forwards 0.3s;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-timing);
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease forwards 0.6s;
}

.cta-button:hover {
  transform: translateY(-2px);
  background: var(--primary-dark);
  box-shadow: 0 6px 12px rgba(76, 175, 80, 0.2);
}

.button-icon {
  transition: transform var(--transition-timing);
}

.cta-button:hover .button-icon {
  transform: translateX(5px);
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  animation: fadeIn 1s ease forwards 1s;
}

.mouse {
  width: 30px;
  height: 50px;
  border: 2px solid white;
  border-radius: 15px;
  position: relative;
}

.wheel {
  width: 4px;
  height: 8px;
  background: white;
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 2px;
  animation: scroll 1.5s infinite;
}

/* Concept Section */
.concept-section {
  padding: 100px 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.section-header.visible {
  opacity: 1;
  transform: translateY(0);
}

.section-title {
  font-size: 2.5rem;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.2rem;
  color: rgba(44, 24, 16, 0.7);
}

/*concept*/
.concept-grid {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.concept-card {
  width: 23%;
  background: white;
  padding: 30px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
  transition-delay: var(--delay);
}

.concept-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.concept-icon {
  font-size: 2.5rem;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.concept-card:hover .concept-icon {
  transform: scale(1.2) rotate(10deg);
}

.concept-number {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.concept-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.concept-description {
  font-size: 1rem;
  color: rgba(44, 24, 16, 0.7);
}

.concept-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.concept-card:hover .concept-hover-effect {
  opacity: 1;
}

/* Mood Section */
.mood-section {
  padding: 100px 20px;
  background: white;
}

.mood-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.mood-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
  transition-delay: var(--delay);
}

.mood-grid.visible .mood-card {
  opacity: 1;
  transform: translateY(0);
}

.mood-image-wrapper {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

.mood-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: all 0.3s ease;
}

.mood-image.loaded {
  opacity: 1;
}

.mood-content {
  padding: 20px;
}

.mood-title {
  font-size: 1.3rem;
  color: var(--text-color);
  margin-bottom: 10px;
}

.mood-subtitle {
  color: rgba(44, 24, 16, 0.7);
  margin-bottom: 10px;
}

.mood-film {
  font-size: 0.9rem;
  color: rgba(44, 24, 16, 0.6);
}

.film-label {
  font-weight: 600;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 40px;
}

.loading-spinner {
  margin-bottom: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 40px;
  max-width: 400px;
  margin: 0 auto;
}

.error-icon {
  width: 50px;
  height: 50px;
  background: #ff4444;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 20px;
}

.retry-button {
  margin-top: 20px;
  padding: 10px 20px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: var(--primary-dark);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scroll {
  0% {
    transform: translate(-50%, 0);
  }
  50% {
    transform: translate(-50%, 10px);
  }
  100% {
    transform: translate(-50%, 0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Media Queries */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-description {
    font-size: 1.2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .concept-grid,
  .mood-grid {
    grid-template-columns: 1fr;
    padding: 0 10px;
  }
}
</style>
