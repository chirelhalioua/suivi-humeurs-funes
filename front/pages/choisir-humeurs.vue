<template>
  <div class="choose-mood-page">
    <section class="mood-shell">
      <header class="mood-header">
        <span class="mood-kicker">TON HUMEUR DU MOMENT</span>
        <h1>Alors, quelle est ton humeur aujourd’hui ?</h1>
        <p>Choisis celle qui te ressemble le plus, avec une touche de Louis de Funès.</p>
      </header>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement des humeurs...</p>
      </div>

      <div v-else-if="currentMood" class="mood-experience">
        <div class="mood-stage">
          <button
            class="nav-arrow"
            type="button"
            aria-label="Humeur précédente"
            :disabled="!canNavigate"
            @click="prevMood"
          >
            <span>←</span>
          </button>

          <article class="mood-card">
            <div class="mood-image-wrap">
              <img :src="currentMood.image" :alt="currentMood.title" class="mood-image" />
              <span v-if="currentMood.film" class="film-pill">{{ currentMood.film }}</span>
            </div>

            <div class="mood-copy">
              <div class="mood-meta-row">
                <span class="mood-count">0{{ currentIndex + 1 }}</span>
                <span class="mood-total">/ 0{{ humeurs.length }}</span>
              </div>

              <h2>{{ currentMood.title }}</h2>
              <p class="film-quote">“{{ currentMood.subtitle }}”</p>
            </div>
          </article>

          <button
            class="nav-arrow"
            type="button"
            aria-label="Humeur suivante"
            :disabled="!canNavigate"
            @click="nextMood"
          >
            <span>→</span>
          </button>
        </div>

        <div class="quick-moods" aria-label="Choisir rapidement une humeur">
          <button
            v-for="(mood, index) in humeurs"
            :key="mood._id"
            type="button"
            :class="['quick-mood', { active: index === currentIndex }]"
            @click="selectMood(index)"
          >
            <span class="quick-emoji">{{ moodEmoji(mood.title, index) }}</span>
            <span>{{ mood.title }}</span>
          </button>
        </div>

        <div class="mood-note">
          <div class="note-heading">
            <div>
              <span class="note-kicker">UN PETIT MOT ?</span>
              <label for="mood-description">Décris ce qui accompagne cette humeur</label>
            </div>
            <span>optionnel</span>
          </div>

          <textarea
            id="mood-description"
            v-model="description"
            placeholder="Ex. Une bonne nouvelle, une journée chargée, un moment drôle..."
            maxlength="240"
          ></textarea>
          <span class="char-count">{{ description.length }}/240</span>
        </div>

        <button
          class="save-mood-btn"
          type="button"
          :disabled="!canChooseMood || isSaving"
          @click="saveMood"
        >
          <span>{{ isSaving ? 'Enregistrement...' : 'Enregistrer mon humeur' }}</span>
          <span class="save-icon">✓</span>
        </button>

        <p v-if="!canChooseMood" class="availability-note">
          Tu peux enregistrer ton humeur le matin entre 6h et 13h, puis le soir entre 17h et 23h.
        </p>

        <Transition name="fade">
          <div
            v-if="notification.message"
            :class="['notification', notification.type]"
            role="alert"
          >
            <span>{{ notification.type === 'success' ? '✓' : '!' }}</span>
            <p>{{ notification.message }}</p>
          </div>
        </Transition>
      </div>

      <div v-else class="empty-state">
        <span>🎭</span>
        <h2>Aucune humeur disponible</h2>
        <p>Réessaie dans quelques instants.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import axios from "axios";

const humeurs = ref([]);
const currentIndex = ref(0);
const description = ref("");
const isLoading = ref(true);
const isSaving = ref(false);
const notification = ref({ message: "", type: "" });

const fetchHumeurs = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(
      "https://suivi-humeurs-funes.onrender.com/api/humeurs"
    );
    humeurs.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    showNotification(
      "Impossible de charger les humeurs. Veuillez réessayer plus tard.",
      "error"
    );
  } finally {
    isLoading.value = false;
  }
};

const currentMood = computed(() => humeurs.value[currentIndex.value]);
const canNavigate = computed(() => humeurs.value.length > 1);

const canChooseMood = computed(() => {
  const currentHour = new Date().getHours();
  return (
    (currentHour >= 6 && currentHour < 13) ||
    (currentHour >= 17 && currentHour <= 23)
  );
});

const prevMood = () => {
  if (!humeurs.value.length) return;
  currentIndex.value =
    (currentIndex.value - 1 + humeurs.value.length) % humeurs.value.length;
};

const nextMood = () => {
  if (!humeurs.value.length) return;
  currentIndex.value = (currentIndex.value + 1) % humeurs.value.length;
};

const selectMood = (index) => {
  currentIndex.value = index;
};

const moodEmoji = (title = "", index = 0) => {
  const value = title.toLowerCase();

  if (value.includes("heureux") || value.includes("joyeux")) return "😄";
  if (value.includes("bien") || value.includes("calme")) return "🙂";
  if (value.includes("moyen") || value.includes("neutre")) return "😐";
  if (value.includes("triste") || value.includes("mal")) return "😢";
  if (value.includes("énerv") || value.includes("ener") || value.includes("colère")) return "😡";
  if (value.includes("fatigu")) return "😴";
  if (value.includes("stress") || value.includes("angoiss")) return "😰";

  return ["🙂", "😄", "😐", "😢", "😡", "😴"][index % 6];
};

const saveMood = async () => {
  if (!currentMood.value) {
    showNotification("Choisis d’abord une humeur.", "error");
    return;
  }

  if (!canChooseMood.value) {
    showNotification(
      "L’enregistrement est disponible le matin de 6h à 13h et le soir de 17h à 23h.",
      "error"
    );
    return;
  }

  const userId = localStorage.getItem("userId");

  if (!userId) {
    showNotification(
      "Impossible d’enregistrer l’humeur : utilisateur non connecté.",
      "error"
    );
    return;
  }

  const hours = new Date().getHours();
  const timeOfDay = hours >= 6 && hours < 13 ? "morning" : "evening";

  const userMoodChoice = {
    date: new Date().toISOString().split("T")[0],
    humeurId: currentMood.value._id,
    description: description.value.trim() || "Aucune description fournie",
    userId,
    timeOfDay,
  };

  try {
    isSaving.value = true;
    notification.value = { message: "", type: "" };

    const response = await axios.post(
      "https://suivi-humeurs-funes.onrender.com/api/humeurs_utilisateurs",
      userMoodChoice
    );

    if (response.status === 200 || response.status === 201) {
      localStorage.setItem("userMoodChoice", JSON.stringify(userMoodChoice));
      showNotification(
        response.status === 200
          ? "Ton humeur a bien été mise à jour."
          : "Ton humeur a bien été enregistrée.",
        "success"
      );
    } else {
      showNotification("L’enregistrement de l’humeur a échoué.", "error");
    }
  } catch (error) {
    showNotification(
      error.response?.data?.message ||
        "Une erreur est survenue lors de l’enregistrement.",
      "error"
    );
  } finally {
    isSaving.value = false;
  }
};

function showNotification(message, type) {
  notification.value = { message, type };

  setTimeout(() => {
    notification.value = { message: "", type: "" };
  }, 5000);
}

onMounted(fetchHumeurs);
</script>

<style scoped>
.choose-mood-page {
  --brown: #2c1810;
  --brown-soft: #6b4b3e;
  --cream: #f4e4bc;
  --cream-light: #fffaf0;
  --gold: #e9b949;
  --green: #78986a;
  min-height: 100vh;
  padding: clamp(2rem, 5vw, 4.5rem) 1rem 5rem;
  background:
    radial-gradient(circle at 12% 8%, rgba(233, 185, 73, 0.15), transparent 24%),
    radial-gradient(circle at 88% 16%, rgba(120, 152, 106, 0.09), transparent 22%),
    linear-gradient(180deg, #fffaf0 0%, #f7edcf 100%);
  color: var(--brown);
}

.mood-shell {
  width: min(820px, 100%);
  margin: 0 auto;
}

.mood-header {
  max-width: 600px;
  margin: 0 auto 1.35rem;
  text-align: center;
}

.mood-kicker,
.note-kicker {
  display: inline-block;
  margin-bottom: 0.45rem;
  color: #9b6d1f;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.mood-header h1 {
  margin: 0;
  font-family: "Sora", sans-serif;
  font-size: clamp(1.8rem, 3.2vw, 2.65rem);
  line-height: 1.08;
}

.mood-header p {
  max-width: 560px;
  margin: 0.75rem auto 0;
  color: rgba(44, 24, 16, 0.6);
  font-size: 0.95rem;
  line-height: 1.6;
}

.mood-experience {
  padding: clamp(0.9rem, 2vw, 1.15rem);
  border: 1px solid rgba(44, 24, 16, 0.07);
  border-radius: 30px;
  background: linear-gradient(
    145deg,
    rgba(255, 253, 248, 0.94),
    rgba(240, 246, 236, 0.78)
  );
  box-shadow: 0 18px 46px rgba(44, 24, 16, 0.07);
}

.mood-stage {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 42px;
  align-items: center;
  gap: 0.75rem;
}

.nav-arrow {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(44, 24, 16, 0.08);
  border-radius: 50%;
  background: #fffaf0;
  color: var(--brown);
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 7px 18px rgba(44, 24, 16, 0.06);
  transition: transform 0.2s ease, background 0.2s ease;
}

.nav-arrow:hover:not(:disabled) {
  transform: translateY(-2px);
  background: #edf5e9;
}

.nav-arrow:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.mood-card {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(230px, 1.02fr) minmax(200px, 0.98fr);
  overflow: hidden;
  border: 1px solid rgba(44, 24, 16, 0.08);
  border-radius: 24px;
  background: #fffdf8;
  box-shadow: 0 12px 30px rgba(44, 24, 16, 0.055);
}

.mood-image-wrap {
  position: relative;
  height: 235px;
  min-height: 0;
  overflow: hidden;
  background: linear-gradient(145deg, #f2e5c9, #e9f0e5);
}

.mood-image {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: block;
  object-fit: contain;
  object-position: center;
}

.film-pill {
  position: absolute;
  left: 0.85rem;
  bottom: 0.85rem;
  max-width: calc(100% - 1.7rem);
  padding: 0.42rem 0.62rem;
  border-radius: 999px;
  background: rgba(44, 24, 16, 0.86);
  color: #fff8e9;
  font-size: 0.66rem;
  font-weight: 700;
  backdrop-filter: blur(5px);
}

.mood-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(1.1rem, 2.5vw, 1.55rem);
  text-align: left;
}

.mood-meta-row {
  display: flex;
  align-items: baseline;
  gap: 0.15rem;
  margin-bottom: 0.7rem;
}

.mood-count {
  color: var(--green);
  font-family: "Sora", sans-serif;
  font-size: 1rem;
  font-weight: 800;
}

.mood-total {
  color: rgba(44, 24, 16, 0.35);
  font-size: 0.68rem;
  font-weight: 700;
}

.mood-copy h2 {
  margin: 0 0 0.65rem;
  font-family: "Sora", sans-serif;
  font-size: clamp(1.45rem, 2.8vw, 2rem);
  line-height: 1.08;
}

.mood-copy .film-quote {
  margin: 0;
  color: rgba(44, 24, 16, 0.64);
  font-family: "Caveat", cursive;
  font-size: 1.15rem;
  line-height: 1.35;
}

.quick-moods {
  display: flex;
  gap: 0.55rem;
  margin: 0.75rem 0 0;
  padding: 0.25rem 0.15rem 0.45rem;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(120, 152, 106, 0.35) transparent;
}

.quick-mood {
  min-width: 82px;
  flex: 1 0 82px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.58rem 0.5rem;
  border: 1px solid rgba(233, 185, 73, 0.28);
  border-radius: 16px;
  background: linear-gradient(145deg, #fff7dc, #ffedb3);
  color: var(--brown);
  font: inherit;
  font-size: 0.69rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.quick-mood:hover {
  transform: translateY(-2px);
  border-color: rgba(233, 185, 73, 0.58);
  box-shadow: 0 7px 18px rgba(233, 185, 73, 0.12);
}

.quick-mood.active {
  border-color: #e9b949;
  background: linear-gradient(145deg, #ffe898, #ffd15d);
  color: var(--brown);
  box-shadow: 0 7px 18px rgba(233, 185, 73, 0.2);
}

.quick-emoji {
  font-size: 1.25rem;
  line-height: 1;
}

.mood-note {
  position: relative;
  margin-top: 0.75rem;
  padding: 1rem;
  border: 1px solid rgba(44, 24, 16, 0.07);
  border-radius: 18px;
  background: rgba(255, 250, 240, 0.68);
}

.note-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.65rem;
  text-align: left;
}

.note-heading div {
  min-width: 0;
}

.note-heading .note-kicker {
  display: block;
  margin-bottom: 0.2rem;
  font-size: 0.62rem;
}

.note-heading label {
  display: block;
  color: var(--brown);
  font-size: 0.78rem;
  font-weight: 700;
}

.note-heading > span {
  color: rgba(44, 24, 16, 0.42);
  font-size: 0.65rem;
}

.mood-note textarea {
  width: 100%;
  min-height: 76px;
  box-sizing: border-box;
  padding: 0.85rem 0.9rem;
  resize: vertical;
  border: 1px solid rgba(44, 24, 16, 0.12);
  border-radius: 13px;
  background: #fff;
  color: var(--brown);
  font: inherit;
  font-size: 0.82rem;
  line-height: 1.5;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.mood-note textarea:focus {
  outline: none;
  border-color: var(--green);
  box-shadow: 0 0 0 3px rgba(120, 152, 106, 0.14);
}

.char-count {
  display: block;
  margin-top: 0.35rem;
  text-align: right;
  color: rgba(44, 24, 16, 0.38);
  font-size: 0.62rem;
}

.save-mood-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.9rem;
  padding: 0.82rem 0.9rem 0.82rem 1.1rem;
  border: 0;
  border-radius: 15px;
  background: linear-gradient(135deg, #efb735, #f2c65c);
  color: var(--brown);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(233, 185, 73, 0.18);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.save-mood-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 13px 26px rgba(233, 185, 73, 0.22);
}

.save-mood-btn:disabled {
  opacity: 0.48;
  cursor: not-allowed;
  box-shadow: none;
}

.save-icon {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.58);
}

.availability-note {
  margin: 0.65rem 0 0;
  text-align: center;
  color: rgba(44, 24, 16, 0.5);
  font-size: 0.68rem;
  line-height: 1.45;
}

.notification {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-top: 0.85rem;
  padding: 0.75rem 0.85rem;
  border-radius: 13px;
  font-size: 0.75rem;
  font-weight: 700;
}

.notification span {
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  display: grid;
  place-items: center;
  border-radius: 50%;
}

.notification p {
  margin: 0;
}

.notification.success {
  background: #eaf3e6;
  color: #4d6c44;
}

.notification.success span {
  background: rgba(120, 152, 106, 0.18);
}

.notification.error {
  background: #fff1ee;
  color: #9a382e;
}

.notification.error span {
  background: rgba(154, 56, 46, 0.11);
}

.loading-state,
.empty-state {
  min-height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
  background: rgba(255, 253, 248, 0.72);
  color: var(--brown);
  text-align: center;
}

.spinner {
  width: 46px;
  height: 46px;
  margin-bottom: 1rem;
  border: 3px solid rgba(44, 24, 16, 0.1);
  border-top-color: var(--green);
  border-radius: 50%;
  animation: spin 0.85s linear infinite;
}

.empty-state > span {
  font-size: 2rem;
}

.empty-state h2 {
  margin: 0.75rem 0 0.35rem;
  font-family: "Sora", sans-serif;
}

.empty-state p {
  margin: 0;
  color: rgba(44, 24, 16, 0.55);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 780px) {
  .mood-stage {
    grid-template-columns: 38px minmax(0, 1fr) 38px;
    gap: 0.55rem;
  }

  .nav-arrow {
    width: 38px;
    height: 38px;
  }

  .mood-card {
    grid-template-columns: 1fr;
  }

  .mood-image-wrap,
  .mood-image {
    height: 250px;
    min-height: 250px;
    max-height: 250px;
  }

  .mood-copy {
    padding: 1.2rem;
  }
}

@media (max-width: 560px) {
  .choose-mood-page {
    padding: 1.6rem 0.75rem 3.5rem;
  }

  .mood-header {
    margin-bottom: 1.25rem;
  }

  .mood-header p {
    font-size: 0.84rem;
  }

  .mood-experience {
    padding: 0.75rem;
    border-radius: 22px;
  }

  .mood-stage {
    position: relative;
    display: block;
  }

  .nav-arrow {
    position: absolute;
    z-index: 3;
    top: 122px;
    width: 36px;
    height: 36px;
    background: rgba(255, 250, 240, 0.92);
  }

  .nav-arrow:first-child {
    left: 0.6rem;
  }

  .nav-arrow:last-child {
    right: 0.6rem;
  }

  .mood-card {
    border-radius: 18px;
  }

  .mood-image-wrap,
  .mood-image {
    height: 225px;
    min-height: 225px;
    max-height: 225px;
  }

  .film-pill {
    left: 0.65rem;
    bottom: 0.65rem;
    max-width: calc(100% - 1.3rem);
  }

  .mood-copy h2 {
    font-size: 1.65rem;
  }

  .mood-copy p {
    font-size: 0.82rem;
  }

  .quick-moods {
    gap: 0.5rem;
  }

  .quick-mood {
    min-width: 78px;
    flex-basis: 78px;
    padding: 0.62rem 0.45rem;
    font-size: 0.62rem;
  }

  .quick-emoji {
    font-size: 1.25rem;
  }

  .note-heading {
    align-items: flex-start;
  }
}

@media (max-width: 390px) {
  .mood-image-wrap,
  .mood-image {
    height: 205px;
    min-height: 205px;
    max-height: 205px;
  }

  .nav-arrow {
    top: 108px;
  }
}
</style>
