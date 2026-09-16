<template>
  <div class="wellbeing-page">
    <section class="wellbeing-shell">
      <header class="wellbeing-header">
        <span class="wellbeing-kicker">PRENDRE SOIN DE SOI</span>
        <h1>Conseils bien-être</h1>
        <p>
          De petites idées simples à adapter à ton humeur du moment, sans pression.
        </p>
      </header>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Préparation de tes conseils...</p>
      </div>

      <template v-else>
        <section class="mood-focus">
          <div class="mood-focus-copy">
            <span class="focus-kicker">{{ recentMood ? "SELON TA DERNIÈRE HUMEUR" : "POUR AUJOURD’HUI" }}</span>
            <h2 v-if="recentMood">
              Tu te sens <span>{{ recentMood.title.toLowerCase() }}</span>
            </h2>
            <h2 v-else>Un petit moment pour toi</h2>
            <p>
              {{ introText }}
            </p>
          </div>

          <div class="focus-emoji" aria-hidden="true">{{ moodEmoji }}</div>
        </section>

        <section class="advice-grid">
          <article
            v-for="advice in currentAdvices"
            :key="advice.title"
            class="advice-card"
          >
            <div class="advice-icon">{{ advice.icon }}</div>
            <div>
              <h3>{{ advice.title }}</h3>
              <p>{{ advice.text }}</p>
            </div>
          </article>
        </section>

        <section class="mini-ritual">
          <div>
            <span class="wellbeing-kicker">PAUSE EXPRESS</span>
            <h2>Un petit rituel de 5 minutes</h2>
            <p>
              Pas besoin de tout changer : quelques minutes peuvent déjà t’aider à te recentrer.
            </p>
          </div>

          <div class="ritual-steps">
            <div v-for="(step, index) in ritualSteps" :key="step">
              <span>0{{ index + 1 }}</span>
              <p>{{ step }}</p>
            </div>
          </div>
        </section>

        <section class="gentle-note">
          <span>💛</span>
          <div>
            <h3>À garder en tête</h3>
            <p>
              Ces conseils sont de petites pistes de bien-être, pas des conseils médicaux.
              Si quelque chose te pèse durablement, parler à un professionnel ou à une personne de confiance peut aider.
            </p>
          </div>
        </section>

        <div class="wellbeing-actions">
          <NuxtLink to="/choisir-humeurs" class="primary-action">
            Choisir mon humeur
            <span>→</span>
          </NuxtLink>
          <NuxtLink v-if="isAuthenticated" to="/suivi-humeurs" class="secondary-action">
            Voir mon suivi
          </NuxtLink>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import axios from "axios";

const isLoading = ref(true);
const recentMood = ref(null);
const isAuthenticated = ref(false);

const adviceSets = {
  happy: {
    emoji: "☀️",
    intro: "Profite de cette énergie positive et essaie d’en garder une petite trace pour plus tard.",
    advices: [
      { icon: "✨", title: "Savoure le moment", text: "Prends quelques secondes pour remarquer ce qui rend cette journée agréable." },
      { icon: "💌", title: "Partage le positif", text: "Envoie un message à quelqu’un que tu apprécies ou partage une bonne nouvelle." },
      { icon: "📝", title: "Garde une trace", text: "Note une chose qui t’a fait sourire aujourd’hui. Tu pourras la relire un jour plus gris." },
    ],
  },
  calm: {
    emoji: "🌿",
    intro: "Tu sembles dans une énergie plutôt stable. C’est un bon moment pour préserver ce rythme.",
    advices: [
      { icon: "🌬️", title: "Respire tranquillement", text: "Fais quelques respirations lentes et relâche volontairement les épaules." },
      { icon: "🚶", title: "Bouge un peu", text: "Une petite marche ou quelques étirements peuvent prolonger cette sensation d’équilibre." },
      { icon: "💧", title: "Pense à toi", text: "Bois un verre d’eau et accorde-toi une vraie petite pause avant de repartir." },
    ],
  },
  neutral: {
    emoji: "🌤️",
    intro: "Une journée moyenne n’a pas besoin d’être transformée. Un petit changement suffit parfois.",
    advices: [
      { icon: "🪟", title: "Change d’air", text: "Ouvre une fenêtre ou sors quelques minutes pour couper avec ce que tu fais." },
      { icon: "🎵", title: "Ajoute quelque chose d’agréable", text: "Mets une musique que tu aimes ou prévois un petit moment sympa dans ta journée." },
      { icon: "✅", title: "Une seule petite chose", text: "Choisis une tâche courte et fais-la sans chercher à tout régler d’un coup." },
    ],
  },
  sad: {
    emoji: "🌧️",
    intro: "Aujourd’hui semble un peu plus difficile. Essaie surtout de te traiter avec douceur.",
    advices: [
      { icon: "🤍", title: "Allège la pression", text: "Autorise-toi à faire moins aujourd’hui si tu en as besoin." },
      { icon: "📞", title: "Ne reste pas seule avec tout", text: "Un message ou un appel à une personne de confiance peut déjà faire du bien." },
      { icon: "🫖", title: "Crée un moment réconfortant", text: "Choisis quelque chose de simple : une boisson chaude, une douche, une musique ou un peu de repos." },
    ],
  },
  angry: {
    emoji: "🔥",
    intro: "Quand la tension monte, le plus utile est souvent de créer un peu d’espace avant de réagir.",
    advices: [
      { icon: "⏸️", title: "Fais une pause", text: "Éloigne-toi quelques minutes de ce qui t’énerve avant de répondre ou de décider." },
      { icon: "🚶", title: "Décharge l’énergie", text: "Marche un peu ou bouge doucement pour laisser retomber la tension." },
      { icon: "🗒️", title: "Pose les mots", text: "Écris ce qui t’agace sans l’envoyer. Relis-le plus tard, une fois plus calme." },
    ],
  },
  tired: {
    emoji: "🌙",
    intro: "Ton énergie est basse : aujourd’hui, le but peut simplement être de récupérer un peu.",
    advices: [
      { icon: "💧", title: "Hydrate-toi", text: "Commence par un verre d’eau et vérifie si tu as suffisamment mangé." },
      { icon: "👀", title: "Coupe les écrans", text: "Accorde quelques minutes de repos à tes yeux et à ton attention." },
      { icon: "🛋️", title: "Choisis l’essentiel", text: "Garde les tâches importantes et reporte ce qui peut attendre." },
    ],
  },
  stressed: {
    emoji: "🍃",
    intro: "Si tout paraît trop chargé, ramène ton attention à une seule chose à la fois.",
    advices: [
      { icon: "🌬️", title: "Ralentis la respiration", text: "Inspire doucement puis expire un peu plus longtemps, plusieurs fois." },
      { icon: "1️⃣", title: "Choisis une priorité", text: "Écris la seule chose vraiment importante à faire maintenant et commence par elle." },
      { icon: "🚪", title: "Fais une micro-coupure", text: "Deux à cinq minutes loin de l’écran ou du bruit peuvent aider à retrouver de la clarté." },
    ],
  },
};

const detectMoodKey = (title = "") => {
  const value = title.toLowerCase();

  if (value.includes("heureux") || value.includes("joyeux") || value.includes("génial")) return "happy";
  if (value.includes("bien") || value.includes("calme")) return "calm";
  if (value.includes("triste") || value.includes("mal") || value.includes("pas top")) return "sad";
  if (value.includes("énerv") || value.includes("ener") || value.includes("colère") || value.includes("nul")) return "angry";
  if (value.includes("fatigu")) return "tired";
  if (value.includes("stress") || value.includes("angoiss")) return "stressed";

  return "neutral";
};

const currentSet = computed(() => adviceSets[detectMoodKey(recentMood.value?.title)]);
const currentAdvices = computed(() => currentSet.value.advices);
const introText = computed(() => currentSet.value.intro);
const moodEmoji = computed(() => currentSet.value.emoji);

const ritualSteps = computed(() => {
  const key = detectMoodKey(recentMood.value?.title);

  if (key === "stressed" || key === "angry") {
    return [
      "Pose le téléphone et éloigne-toi de ce qui te sollicite.",
      "Fais cinq respirations lentes.",
      "Demande-toi : « de quoi ai-je besoin maintenant ? »",
    ];
  }

  if (key === "sad" || key === "tired") {
    return [
      "Installe-toi confortablement et relâche les épaules.",
      "Bois quelque chose et respire tranquillement.",
      "Choisis une seule petite chose douce à faire ensuite.",
    ];
  }

  return [
    "Éloigne-toi de l’écran quelques instants.",
    "Respire profondément et étire doucement le haut du corps.",
    "Choisis une petite intention agréable pour la suite de ta journée.",
  ];
});

const fetchLatestMood = async (userId) => {
  const response = await axios.get(
    `https://suivi-humeurs-funes.onrender.com/api/humeurs_utilisateurs/${userId}`
  );

  const entries = Array.isArray(response.data) ? response.data : [];
  if (!entries.length) return;

  const latestEntry = [...entries].sort((a, b) => {
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
};

onMounted(async () => {
  const userId = localStorage.getItem("userId");
  isAuthenticated.value = Boolean(userId);

  if (userId) {
    try {
      await fetchLatestMood(userId);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Erreur lors du chargement des conseils bien-être :", error);
      }
    }
  }

  isLoading.value = false;
});
</script>

<style scoped>
.wellbeing-page {
  --brown: #2c1810;
  --cream: #f4e4bc;
  --gold: #e9b949;
  --green: #78986a;
  min-height: 100vh;
  padding: clamp(2rem, 5vw, 4.5rem) 1rem 5rem;
  background:
    radial-gradient(circle at 12% 8%, rgba(233, 185, 73, 0.14), transparent 24%),
    radial-gradient(circle at 88% 12%, rgba(120, 152, 106, 0.1), transparent 22%),
    linear-gradient(180deg, #fffaf0 0%, #f7edcf 100%);
  color: var(--brown);
}

.wellbeing-shell {
  width: min(920px, 100%);
  margin: 0 auto;
}

.wellbeing-header {
  max-width: 650px;
  margin: 0 auto 1.5rem;
  text-align: center;
}

.wellbeing-kicker,
.focus-kicker {
  display: inline-block;
  margin-bottom: 0.45rem;
  color: #9b6d1f;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.wellbeing-header h1 {
  margin: 0;
  font-family: "Sora", sans-serif;
  font-size: clamp(1.8rem, 3.2vw, 2.65rem);
  line-height: 1.08;
}

.wellbeing-header p {
  max-width: 560px;
  margin: 0.75rem auto 0;
  color: rgba(44, 24, 16, 0.6);
  font-size: 0.95rem;
  line-height: 1.6;
}

.mood-focus {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  padding: 1.15rem 1.25rem;
  border: 1px solid rgba(120, 152, 106, 0.17);
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(255,255,255,.82), rgba(235,244,230,.8));
  box-shadow: 0 12px 30px rgba(44,24,16,.05);
}

.mood-focus h2 {
  margin: 0;
  font-family: "Sora", sans-serif;
  font-size: clamp(1.2rem, 2.4vw, 1.65rem);
}

.mood-focus h2 span {
  color: #5f8055;
}

.mood-focus p {
  max-width: 650px;
  margin: 0.45rem 0 0;
  color: rgba(44,24,16,.6);
  font-size: 0.82rem;
  line-height: 1.55;
}

.focus-emoji {
  width: 62px;
  height: 62px;
  display: grid;
  place-items: center;
  border-radius: 20px;
  background: #fff2c5;
  font-size: 1.85rem;
}

.advice-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 0.8rem;
}

.advice-card {
  min-width: 0;
  padding: 1rem;
  border: 1px solid rgba(233,185,73,.18);
  border-radius: 20px;
  background: rgba(255,255,255,.68);
}

.advice-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  margin-bottom: 0.75rem;
  border-radius: 12px;
  background: linear-gradient(145deg, #fff3c8, #ffe69a);
  font-size: 1.05rem;
}

.advice-card h3 {
  margin: 0;
  font-family: "Sora", sans-serif;
  font-size: 0.9rem;
}

.advice-card p {
  margin: 0.38rem 0 0;
  color: rgba(44,24,16,.55);
  font-size: 0.72rem;
  line-height: 1.55;
}

.mini-ritual {
  display: grid;
  grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr);
  gap: 1.4rem;
  margin-top: 0.8rem;
  padding: 1.1rem 1.2rem;
  border-radius: 22px;
  background: #fff3cf;
}

.mini-ritual h2 {
  margin: 0;
  font-family: "Sora", sans-serif;
  font-size: 1.05rem;
}

.mini-ritual > div:first-child > p {
  margin: 0.42rem 0 0;
  color: rgba(44,24,16,.56);
  font-size: 0.72rem;
  line-height: 1.5;
}

.ritual-steps {
  display: grid;
  gap: 0.45rem;
}

.ritual-steps > div {
  display: grid;
  grid-template-columns: 32px 1fr;
  align-items: center;
  gap: 0.55rem;
  padding: 0.48rem 0.6rem;
  border-radius: 13px;
  background: rgba(255,255,255,.58);
}

.ritual-steps span {
  color: #6f8c63;
  font-size: 0.62rem;
  font-weight: 800;
}

.ritual-steps p {
  margin: 0;
  font-size: 0.68rem;
  line-height: 1.4;
}

.gentle-note {
  display: flex;
  gap: 0.7rem;
  margin-top: 0.8rem;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(44,24,16,.06);
  border-radius: 17px;
  background: rgba(255,255,255,.55);
}

.gentle-note > span {
  font-size: 1.05rem;
}

.gentle-note h3 {
  margin: 0;
  font-size: 0.76rem;
}

.gentle-note p {
  margin: 0.25rem 0 0;
  color: rgba(44,24,16,.5);
  font-size: 0.62rem;
  line-height: 1.5;
}

.wellbeing-actions {
  display: flex;
  justify-content: center;
  gap: 0.55rem;
  margin-top: 1rem;
}

.primary-action,
.secondary-action {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 0.9rem;
  border-radius: 13px;
  font-size: 0.72rem;
  font-weight: 700;
  text-decoration: none;
}

.primary-action {
  background: var(--brown);
  color: #fff8e9;
}

.secondary-action {
  border: 1px solid rgba(44,24,16,.1);
  background: rgba(255,255,255,.7);
  color: var(--brown);
}

.loading-state {
  min-height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 42px;
  height: 42px;
  margin-bottom: 0.8rem;
  border: 3px solid rgba(44,24,16,.1);
  border-top-color: var(--green);
  border-radius: 50%;
  animation: spin .85s linear infinite;
}

.loading-state p {
  color: rgba(44,24,16,.55);
  font-size: .75rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 720px) {
  .wellbeing-page {
    padding: 1.6rem 0.75rem 3rem;
  }

  .wellbeing-header p {
    font-size: 0.84rem;
  }

  .mood-focus {
    padding: 0.9rem;
    border-radius: 18px;
  }

  .focus-emoji {
    width: 50px;
    height: 50px;
    border-radius: 15px;
    font-size: 1.45rem;
  }

  .advice-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .advice-card {
    display: grid;
    grid-template-columns: 38px 1fr;
    gap: 0.7rem;
    padding: 0.8rem;
    border-radius: 16px;
  }

  .advice-icon {
    margin-bottom: 0;
  }

  .mini-ritual {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 0.9rem;
    border-radius: 18px;
  }

  .wellbeing-actions {
    flex-direction: column;
  }

  .primary-action,
  .secondary-action {
    justify-content: center;
  }
}

@media (max-width: 430px) {
  .wellbeing-header h1 {
    font-size: 1.8rem;
  }

  .mood-focus {
    grid-template-columns: 1fr auto;
    gap: 0.65rem;
  }

  .mood-focus p {
    font-size: 0.72rem;
  }
}
</style>
