<template>
  <div class="profile-page">
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement de ton espace...</p>
    </div>

    <div v-else-if="user" class="profile-container">
      <header class="dashboard-header">
        <div class="welcome-copy">
          <span class="dashboard-kicker">MON ESPACE</span>
          <h1>Bonjour, {{ firstName }} <span aria-hidden="true">👋</span></h1>
          <p>Alors, quelle est ton humeur aujourd’hui ?</p>
        </div>

      </header>

      <article class="dashboard-card account-card account-card-top">
        <div class="account-main">
          <div class="account-heading">
            <div class="account-avatar">{{ user.name.charAt(0).toUpperCase() }}</div>
            <div class="account-title-copy">
              <span class="card-kicker">MON COMPTE</span>
              <h2>{{ user.name }}</h2>
              <p>{{ user.email }}</p>
            </div>
          </div>

          <div class="account-details">
            <div class="account-detail">
              <span>Profil</span>
              <strong>{{ user.name }}</strong>
            </div>
            <div class="account-detail">
              <span>Adresse e-mail</span>
              <strong>{{ user.email }}</strong>
            </div>
          </div>
        </div>

        <div class="account-actions">
          <button class="password-btn" @click="goToPasswordReset">
            <i class="fas fa-key"></i>
            Modifier le mot de passe
          </button>
          <button class="logout-btn" @click="logout">
            <i class="fas fa-sign-out-alt"></i>
            Se déconnecter
          </button>
          <button class="delete-btn" @click="confirmDelete">
            <i class="fas fa-trash-alt"></i>
            Supprimer le profil
          </button>
        </div>
      </article>

      <section class="dashboard-grid">
        <article class="dashboard-card mood-card-main">
          <div class="card-heading">
            <div>
              <span class="card-kicker">AUJOURD’HUI</span>
              <h2>Mon humeur</h2>
            </div>
            <button class="mini-action" @click="goToHumeursChoice">
              {{ recentMood ? 'Changer' : 'Choisir' }}
              <span>→</span>
            </button>
          </div>

          <div v-if="recentMood" class="current-mood">
            <div class="current-mood-image">
              <img :src="recentMood.image" :alt="recentMood.title" />
            </div>
            <div class="current-mood-copy">
              <span class="mood-meta">
                {{ recentMoodPeriod }} · {{ formatMoodDate(recentMood.date) }}
              </span>
              <h3>{{ recentMood.title }}</h3>
              <p>{{ recentMood.subtitle }}</p>
              <small v-if="recentMood.film">🎬 {{ recentMood.film }}</small>
            </div>
          </div>

          <div v-else class="empty-mood">
            <div class="empty-mood-icon">🙂</div>
            <div>
              <h3>Pas encore d’humeur enregistrée</h3>
              <p>Choisis celle qui te ressemble le plus aujourd’hui.</p>
            </div>
          </div>

          <p class="handwritten-dashboard">
            Une humeur, une expression…
            <span>↗</span>
          </p>
        </article>

        <article class="dashboard-card tracking-card">
          <div class="card-heading tracking-heading">
            <div>
              <span class="card-kicker">MON SUIVI</span>
              <h2>Cette semaine</h2>
            </div>
            <span class="week-total">{{ weekCount }} humeur{{ weekCount > 1 ? 's' : '' }}</span>
          </div>

          <div class="week-chart" aria-label="Humeurs enregistrées sur les sept derniers jours">
            <div v-for="bar in weeklyBars" :key="bar.key" class="bar-column">
              <div class="bar-track">
                <span
                  class="bar-fill"
                  :class="{ empty: bar.count === 0 }"
                  :style="{ height: bar.height }"
                ></span>
              </div>
              <span class="bar-label">{{ bar.label }}</span>
            </div>
          </div>

          <div class="tracking-summary">
            <div>
              <strong>{{ activeDays }}</strong>
              <span>jours suivis</span>
            </div>
            <div>
              <strong>{{ moodEntries.length }}</strong>
              <span>humeurs au total</span>
            </div>
          </div>

          <button class="secondary-action" @click="goToMoodTracking">
            Voir tout mon suivi
            <span>→</span>
          </button>
        </article>

        <aside class="quote-card">
          <span class="quote-mark">“</span>
          <p>Le bonheur, ça se cultive aussi dans les petits moments.</p>
          <span class="quote-signature">À la manière de Louis de Funès</span>
        </aside>


      </section>
    </div>

    <Transition name="modal">
      <div v-if="showConfirmDelete" class="modal-overlay" @click="cancelDelete">
        <div class="modal-content" @click.stop>
          <div class="modal-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h2>Supprimer le profil ?</h2>
          <p>Cette action est irréversible. Toutes tes données seront définitivement supprimées.</p>
          <div class="modal-actions">
            <button class="cancel-btn" @click="cancelDelete">
              Annuler
            </button>
            <button class="confirm-btn" @click="deleteProfile">
              Confirmer la suppression
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref(null);
const isLoading = ref(true);
const showConfirmDelete = ref(false);
const moodEntries = ref([]);
const recentMood = ref(null);

const firstName = computed(() => user.value?.name?.trim().split(/\s+/)[0] || "toi");

const recentMoodPeriod = computed(() => {
  if (!recentMood.value) return "";
  return recentMood.value.timeOfDay === "morning" ? "Matin" : "Soir";
});

const normalizeDay = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const lastSevenDays = computed(() => {
  const today = normalizeDay(new Date());

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return date;
  });
});

const weeklyBars = computed(() => {
  const labels = ["D", "L", "M", "M", "J", "V", "S"];

  return lastSevenDays.value.map((date) => {
    const count = moodEntries.value.filter((entry) => {
      return normalizeDay(entry.date).getTime() === date.getTime();
    }).length;

    return {
      key: date.toISOString(),
      label: labels[date.getDay()],
      count,
      height: count === 0 ? "12%" : count === 1 ? "56%" : "100%",
    };
  });
});

const weekCount = computed(() => weeklyBars.value.reduce((sum, bar) => sum + bar.count, 0));
const activeDays = computed(() => weeklyBars.value.filter((bar) => bar.count > 0).length);

const formatMoodDate = (date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));
};

const fetchMoodSummary = async (userId) => {
  try {
    const response = await axios.get(
      `https://suivi-humeurs-funes.onrender.com/api/humeurs_utilisateurs/${userId}`
    );

    const rawEntries = Array.isArray(response.data) ? response.data : [];

    // Les anciennes versions pouvaient créer plusieurs entrées pour le même jour/créneau.
    // On garde uniquement la plus récente pour chaque jour + matin/soir.
    const uniqueEntries = new Map();

    rawEntries.forEach((entry) => {
      const dayKey = new Date(entry.date).toISOString().slice(0, 10);
      const key = `${dayKey}-${entry.timeOfDay}`;
      const current = uniqueEntries.get(key);

      if (!current || String(entry._id) > String(current._id)) {
        uniqueEntries.set(key, entry);
      }
    });

    moodEntries.value = Array.from(uniqueEntries.values());

    if (!moodEntries.value.length) return;

    const latestEntry = [...moodEntries.value].sort((a, b) => {
      const dateDiff = new Date(b.date) - new Date(a.date);
      if (dateDiff !== 0) return dateDiff;
      return String(b._id).localeCompare(String(a._id));
    })[0];

    const moodResponse = await axios.get(
      `https://suivi-humeurs-funes.onrender.com/api/humeurs/${latestEntry.humeurId}`
    );

    recentMood.value = {
      ...moodResponse.data,
      date: latestEntry.date,
      timeOfDay: latestEntry.timeOfDay,
    };
  } catch (error) {
    if (error.response?.status !== 404) {
      console.error("Erreur lors du chargement du résumé des humeurs :", error);
    }
  }
};

const fetchUserProfile = async () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    router.push("/login");
    return;
  }

  try {
    const [profileResponse] = await Promise.all([
      axios.get("https://suivi-humeurs-funes.onrender.com/api/auth/profil", {
        params: { userId },
      }),
      fetchMoodSummary(userId),
    ]);

    if (!profileResponse.data?.user) {
      throw new Error("Profil non trouvé");
    }

    user.value = profileResponse.data.user;
  } catch (error) {
    console.error("Erreur lors du chargement du profil :", error);
    router.push("/login");
  } finally {
    isLoading.value = false;
  }
};

const logout = () => {
  localStorage.removeItem("userId");
  router.push("/login");
};

const goToHumeursChoice = () => router.push("/choisir-humeurs");
const goToMoodTracking = () => router.push("/suivi-humeurs");
const goToPasswordReset = () => router.push({
  path: "/reset-password",
  query: { email: user.value?.email || "" },
});
const confirmDelete = () => (showConfirmDelete.value = true);
const cancelDelete = () => (showConfirmDelete.value = false);

const deleteProfile = async () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    router.push("/login");
    return;
  }

  try {
    await axios.delete(
      `https://suivi-humeurs-funes.onrender.com/api/auth/profil/${userId}`
    );
    localStorage.removeItem("userId");
    router.push("/login");
  } catch (error) {
    console.error("Erreur lors de la suppression du profil :", error.response?.data || error);
    alert(error.response?.data?.message || "Échec de la suppression du profil.");
  }
};

onMounted(fetchUserProfile);
</script>

<style scoped>
.profile-page {
  --brown: #2c1810;
  --brown-soft: #6b4b3e;
  --cream: #f4e4bc;
  --cream-light: #fffaf0;
  --gold: #e9b949;
  --green: #78986a;
  min-height: 100vh;
  padding: clamp(2rem, 5vw, 4.5rem) 1rem 5rem;
  background:
    radial-gradient(circle at 8% 8%, rgba(233, 185, 73, 0.16), transparent 24%),
    radial-gradient(circle at 92% 16%, rgba(120, 152, 106, 0.09), transparent 20%),
    linear-gradient(180deg, #fffaf0 0%, #f7edcf 100%);
  color: var(--brown);
}

.profile-container {
  width: min(1120px, 100%);
  margin: 0 auto;
  animation: fadeIn 0.45s ease;
}

.dashboard-header {
  margin-bottom: 1.4rem;
}

.dashboard-kicker,
.card-kicker {
  display: inline-block;
  margin-bottom: 0.45rem;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: #9b6d1f;
}

.welcome-copy h1 {
  margin: 0;
  font-family: "Sora", sans-serif;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1.06;
}

.welcome-copy p {
  margin: 0.65rem 0 0;
  color: rgba(44, 24, 16, 0.62);
  font-size: 1rem;
}

.user-pill strong {
  font-size: 0.9rem;
}

.user-pill span {
  margin-top: 0.12rem;
  color: rgba(44, 24, 16, 0.55);
  font-size: 0.72rem;
  word-break: break-word;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.18fr 0.82fr;
  gap: 1.2rem;
}

.dashboard-card {
  border: 1px solid rgba(44, 24, 16, 0.08);
  border-radius: 26px;
  background: linear-gradient(145deg, rgba(255, 253, 248, 0.94), rgba(240, 246, 236, 0.78));
  box-shadow: 0 14px 36px rgba(44, 24, 16, 0.055);
}

.mood-card-main {
  position: relative;
  min-height: 370px;
  padding: clamp(1.3rem, 3vw, 2rem);
  overflow: hidden;
}

.mood-card-main::after {
  content: "";
  position: absolute;
  right: -55px;
  bottom: -70px;
  width: 210px;
  height: 210px;
  border-radius: 50%;
  background: rgba(233, 185, 73, 0.13);
  pointer-events: none;
}

.card-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-heading h2,
.account-card h2 {
  margin: 0;
  font-family: "Sora", sans-serif;
  font-size: clamp(1.25rem, 2vw, 1.65rem);
}

.mini-action,
.secondary-action {
  border: 0;
  cursor: pointer;
  font-family: inherit;
}

.mini-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.58rem 0.82rem;
  border-radius: 999px;
  background: var(--brown);
  color: #fff8e9;
  font-size: 0.76rem;
  font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.mini-action:hover,
.secondary-action:hover {
  transform: translateY(-2px);
}

.current-mood {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(180px, 42%) 1fr;
  align-items: center;
  gap: 1.35rem;
}

.current-mood-image {
  min-height: 220px;
  overflow: hidden;
  border-radius: 20px;
  background: #f1e4c7;
}

.current-mood-image img {
  width: 100%;
  height: 100%;
  min-height: 220px;
  display: block;
  object-fit: cover;
}

.mood-meta {
  display: inline-block;
  margin-bottom: 0.45rem;
  color: var(--green);
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.current-mood-copy h3 {
  margin: 0 0 0.45rem;
  font-family: "Sora", sans-serif;
  font-size: clamp(1.45rem, 2.5vw, 2rem);
}

.current-mood-copy p {
  margin: 0 0 0.7rem;
  color: rgba(44, 24, 16, 0.68);
  font-size: 0.9rem;
  line-height: 1.55;
}

.current-mood-copy small {
  color: rgba(44, 24, 16, 0.58);
}

.empty-mood {
  min-height: 210px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: left;
}

.empty-mood-icon {
  display: grid;
  place-items: center;
  width: 68px;
  height: 68px;
  flex: 0 0 68px;
  border-radius: 22px;
  background: linear-gradient(135deg, #f2e0ad, #dcead6);
  font-size: 1.8rem;
}

.empty-mood h3 {
  margin: 0 0 0.35rem;
  font-family: "Sora", sans-serif;
  font-size: 1.1rem;
}

.empty-mood p {
  margin: 0;
  color: rgba(44, 24, 16, 0.6);
  font-size: 0.86rem;
}

.handwritten-dashboard {
  position: relative;
  z-index: 1;
  margin: 1.15rem 0 0;
  text-align: right;
  font-family: "Caveat", cursive;
  font-size: 1.25rem;
  color: var(--brown-soft);
  transform: rotate(-1deg);
}

.handwritten-dashboard span {
  display: inline-block;
  margin-left: 0.25rem;
  color: var(--green);
}

.tracking-card {
  padding: clamp(1.3rem, 3vw, 1.8rem);
}

.tracking-heading {
  align-items: center;
}

.week-total {
  padding: 0.45rem 0.65rem;
  border-radius: 999px;
  background: #e8f1e3;
  color: #4f6d45;
  font-size: 0.7rem;
  font-weight: 800;
}

.week-chart {
  height: 165px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: end;
  gap: 0.55rem;
  padding: 1rem 0 0.45rem;
  border-bottom: 1px solid rgba(44, 24, 16, 0.08);
}

.bar-column {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
}

.bar-track {
  width: min(28px, 70%);
  height: 118px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(44, 24, 16, 0.055);
}

.bar-fill {
  width: 100%;
  min-height: 8px;
  border-radius: inherit;
  background: linear-gradient(180deg, #8eae82, #6f9364);
  transition: height 0.45s ease;
}

.bar-fill.empty {
  background: rgba(120, 152, 106, 0.35);
}

.bar-label {
  color: rgba(44, 24, 16, 0.52);
  font-size: 0.68rem;
  font-weight: 700;
}

.tracking-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin: 1.2rem 0;
}

.tracking-summary div {
  padding: 0.75rem;
  border-radius: 16px;
  background: linear-gradient(145deg, #fffaf0, #eef5ea);
}

.tracking-summary strong,
.tracking-summary span {
  display: block;
}

.tracking-summary strong {
  font-family: "Sora", sans-serif;
  font-size: 1.2rem;
}

.tracking-summary span {
  margin-top: 0.15rem;
  color: rgba(44, 24, 16, 0.55);
  font-size: 0.7rem;
}

.secondary-action {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.78rem 0.9rem;
  border-radius: 14px;
  background: var(--brown);
  color: #fff8e9;
  font-size: 0.78rem;
  font-weight: 700;
  transition: transform 0.2s ease;
}

.quote-card {
  position: relative;
  min-height: 205px;
  padding: 1.7rem;
  overflow: hidden;
  border-radius: 26px;
  background: linear-gradient(145deg, #2b1710, #4a2a1d);
  color: #fff7e8;
  box-shadow: 0 14px 34px rgba(44, 24, 16, 0.13);
}

.quote-mark {
  position: absolute;
  top: -0.55rem;
  left: 1.1rem;
  font-family: Georgia, serif;
  font-size: 5rem;
  color: rgba(233, 185, 73, 0.35);
}

.quote-card p {
  position: relative;
  z-index: 1;
  max-width: 430px;
  margin: 1.55rem 0 1.15rem;
  font-family: "Sora", sans-serif;
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  line-height: 1.5;
}

.quote-signature {
  color: rgba(255, 247, 232, 0.62);
  font-size: 0.72rem;
}

.account-card {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(250px, 0.85fr);
  align-items: center;
  gap: 1.5rem;
  padding: 1.35rem 1.45rem;
}

.account-card-top {
  margin-bottom: 1.2rem;
  border-color: rgba(120, 152, 106, 0.16);
  background:
    linear-gradient(135deg, rgba(255, 253, 248, 0.96), rgba(235, 244, 230, 0.9));
}

.account-main {
  min-width: 0;
}

.account-heading {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.account-avatar {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  flex: 0 0 54px;
  border-radius: 18px;
  background: linear-gradient(135deg, #5f7f55, #78986a);
  color: #fff;
  font-family: "Sora", sans-serif;
  font-size: 1.15rem;
  font-weight: 800;
  box-shadow: 0 8px 20px rgba(120, 152, 106, 0.18);
}

.account-title-copy {
  min-width: 0;
}

.account-title-copy .card-kicker {
  margin-bottom: 0.15rem;
}

.account-title-copy h2 {
  margin: 0;
  font-family: "Sora", sans-serif;
  font-size: clamp(1.1rem, 2vw, 1.35rem);
}

.account-title-copy p {
  margin: 0.2rem 0 0;
  color: rgba(44, 24, 16, 0.55);
  font-size: 0.78rem;
  overflow-wrap: anywhere;
}

.account-details {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: 0.65rem;
  margin-top: 0.95rem;
}

.account-detail {
  min-width: 0;
  padding: 0.68rem 0.78rem;
  border: 1px solid rgba(120, 152, 106, 0.13);
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.48);
}

.account-details span,
.account-details strong {
  display: block;
}

.account-details span {
  margin-bottom: 0.15rem;
  color: rgba(44, 24, 16, 0.46);
  font-size: 0.64rem;
}

.account-details strong {
  color: var(--brown);
  font-size: 0.78rem;
  overflow-wrap: anywhere;
}

.account-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.password-btn,
.logout-btn,
.delete-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.55rem;
  padding: 0.72rem 0.82rem;
  border-radius: 12px;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.password-btn {
  border: 1px solid rgba(120, 152, 106, 0.32);
  background: #eaf3e6;
  color: #48633f;
}

.logout-btn {
  border: 1px solid rgba(44, 24, 16, 0.1);
  background: #fffaf0;
  color: var(--brown);
}

.delete-btn {
  border: 1px solid rgba(163, 58, 46, 0.14);
  background: #fff5f2;
  color: #9a382e;
}

.password-btn:hover,
.logout-btn:hover,
.delete-btn:hover {
  transform: translateY(-1px);
}

.password-btn:hover {
  border-color: rgba(120, 152, 106, 0.5);
  background: #e2efdd;
}

.loading-state {
  min-height: 65vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--brown);
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

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(30, 18, 13, 0.58);
  backdrop-filter: blur(5px);
}

.modal-content {
  width: min(410px, 100%);
  padding: 1.8rem;
  border-radius: 22px;
  background: #fffaf0;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
}

.modal-icon {
  margin-bottom: 0.8rem;
  color: #c48b28;
  font-size: 2.2rem;
}

.modal-content h2 {
  margin: 0 0 0.65rem;
  font-family: "Sora", sans-serif;
}

.modal-content p {
  margin: 0 0 1.3rem;
  color: rgba(44, 24, 16, 0.62);
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 0.7rem;
}

.modal-actions button {
  flex: 1;
  padding: 0.72rem;
  border-radius: 12px;
  font: inherit;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
}

.cancel-btn {
  border: 1px solid rgba(44, 24, 16, 0.1);
  background: #fff;
  color: var(--brown);
}

.confirm-btn {
  border: 0;
  background: #9a382e;
  color: #fff;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .dashboard-header {
    align-items: flex-start;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .quote-card {
    min-height: 170px;
  }

  .account-card {
    grid-template-columns: 1fr;
  }

  .account-actions {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .account-actions button {
    justify-content: center;
    min-width: 0;
  }
}

@media (max-width: 680px) {
  .profile-page {
    padding: 1.65rem 0.85rem 3.5rem;
  }

  .dashboard-header {
    display: block;
    margin-bottom: 1.35rem;
  }

  .welcome-copy p {
    font-size: 0.9rem;
  }

  .dashboard-card,
  .quote-card {
    border-radius: 21px;
  }

  .mood-card-main,
  .tracking-card {
    padding: 1.15rem;
  }

  .current-mood {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .current-mood-image,
  .current-mood-image img {
    min-height: 190px;
    max-height: 230px;
  }

  .handwritten-dashboard {
    text-align: left;
    font-size: 1.1rem;
  }

  .week-chart {
    gap: 0.35rem;
  }

  .bar-track {
    width: min(24px, 72%);
  }

  .account-details {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }

  .account-actions {
    grid-template-columns: 1fr;
  }

  .account-actions button {
    justify-content: flex-start;
  }

  .account-details strong {
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 420px) {
  .card-heading {
    align-items: center;
  }

  .mini-action {
    padding: 0.5rem 0.66rem;
    font-size: 0.7rem;
  }

  .tracking-summary {
    gap: 0.5rem;
  }

  .tracking-summary div {
    padding: 0.65rem;
  }
}
</style>
