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

      <div class="concept-container">
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
      "https://suivi-humeurs-back.onrender.com/api/humeurs",
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
  padding: 1rem;
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
  width: 100%;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease forwards;
}

.hero-description {
  font-size: clamp(1rem, 3vw, 1.5rem);
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease forwards 0.3s;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: clamp(12px, 2vw, 15px) clamp(20px, 4vw, 30px);
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: clamp(1rem, 2vw, 1.2rem);
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

/* Concept Section */
.concept-section {
  padding: clamp(3rem, 8vw, 100px) 1rem;
}

.concept-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-header {
  text-align: center;
  margin-bottom: clamp(2rem, 6vw, 60px);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.section-header.visible {
  opacity: 1;
  transform: translateY(0);
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: var(--text-color);
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: rgba(44, 24, 16, 0.7);
}

.concept-card {
  border: 2px solid transparent;
}

.border-animation {
  background: linear-gradient(
    90deg,
    transparent,
    #4caf50,
    #45a049,
    transparent
  );
  background-size: 200% 100%;
  animation: borderFlow 2s linear infinite;
}

.border-animation::before {
  content: "";
  position: absolute;
  inset: 0;
  background: white;
  margin: 2px;
  border-radius: 18px;
}

@keyframes borderFlow {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (min-width: 768px) {
  .concept-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .concept-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.concept-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.concept-icon {
  font-size: clamp(2rem, 5vw, 2.5rem);
  margin-bottom: 1.25rem;
  transition: transform 0.3s ease;
  display: inline-block;
  animation: iconFloat 3s ease-in-out infinite;
}

.concept-card:hover .concept-icon {
  animation: iconBounce 0.8s cubic-bezier(0.36, 0, 0.66, -0.56) infinite
    alternate;
  transform: scale(1.2);
}

@keyframes iconFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes iconBounce {
  0% {
    transform: scale(1.2) translateY(0) rotate(0);
  }
  100% {
    transform: scale(1.2) translateY(-8px) rotate(10deg);
  }
}

@keyframes gradientBorder {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.concept-number {
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.concept-title {
  font-size: clamp(1.25rem, 3vw, 1.8rem);
  font-weight: 700;
  margin-bottom: 1rem;
}

.concept-description {
  font-size: clamp(0.875rem, 2vw, 1rem);
  color: rgba(44, 24, 16, 0.7);
  flex-grow: 1;
}

/* Mood Section */
.mood-section {
  padding: clamp(3rem, 8vw, 100px) 1rem;
  background: white;
}

.mood-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: clamp(1.5rem, 4vw, 2rem);
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 768px) {
  .mood-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .mood-grid {
    grid-template-columns: repeat(4, 1fr);
  }
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
  height: 100%;
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
  padding: clamp(1rem, 3vw, 1.5rem);
}

.mood-title {
  font-size: clamp(1.1rem, 2.5vw, 1.3rem);
  color: var(--text-color);
  margin-bottom: 0.75rem;
}

.mood-subtitle {
  color: rgba(44, 24, 16, 0.7);
  margin-bottom: 0.75rem;
  font-size: clamp(0.875rem, 2vw, 1rem);
}

.mood-film {
  font-size: clamp(0.8rem, 1.8vw, 0.9rem);
  color: rgba(44, 24, 16, 0.6);
}

/* Touch Interactions */
@media (hover: none) {
  .concept-card {
    transform: none !important;
  }

  .concept-card::before {
    opacity: 0.5;
    animation: gradientBorder 3s ease infinite;
  }

  .concept-icon {
    animation: iconFloat 3s ease-in-out infinite;
  }

  .cta-button:active {
    transform: scale(0.98);
  }
}

@media (prefers-reduced-motion: reduce) {
  .concept-card::before {
    animation: none;
    background: var(--primary-color);
    opacity: 0;
  }

  .concept-icon {
    animation: none;
  }

  .concept-card:hover .concept-icon {
    animation: none;
    transform: scale(1.1);
  }
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

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Loading and Error States */
.loading-state,
.error-state {
  padding: clamp(2rem, 5vw, 3rem);
  text-align: center;
}

.loading-spinner {
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
}

.spinner {
  width: clamp(30px, 8vw, 40px);
  height: clamp(30px, 8vw, 40px);
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Accessibility Improvements */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
