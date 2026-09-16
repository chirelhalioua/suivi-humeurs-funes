<template>
  <div class="tracking-page">
    <section class="tracking-shell">
      <header class="tracking-hero">
        <div>
          <span class="tracking-kicker">MON SUIVI</span>
          <h1>Mes humeurs</h1>
          <p>Observe ton évolution, jour après jour, sans perdre la touche de Louis de Funès.</p>
        </div>

        <div class="summary-cards">
          <template v-if="view === 'daily'">
            <div class="summary-card">
              <span>Matin</span>
              <strong>{{ morningMood ? "✓" : "—" }}</strong>
              <small>{{ morningMood ? morningMood.title : "non renseigné" }}</small>
            </div>
            <div class="summary-card green">
              <span>Soir</span>
              <strong>{{ eveningMood ? "✓" : "—" }}</strong>
              <small>{{ eveningMood ? eveningMood.title : "non renseigné" }}</small>
            </div>
          </template>

          <template v-else-if="view === 'weekly'">
            <div class="summary-card">
              <span>Cette semaine</span>
              <strong>{{ weekTrackedSlots }}</strong>
              <small>humeur{{ weekTrackedSlots > 1 ? "s" : "" }}</small>
            </div>
            <div class="summary-card green">
              <span>Jours suivis</span>
              <strong>{{ weekTrackedDays }}</strong>
              <small>sur 7 jours</small>
            </div>
          </template>

          <template v-else>
            <div class="summary-card">
              <span>Cette année</span>
              <strong>{{ annualTotal }}</strong>
              <small>humeur{{ annualTotal > 1 ? "s" : "" }}</small>
            </div>
            <div class="summary-card green">
              <span>Mois actifs</span>
              <strong>{{ annualActiveMonths }}</strong>
              <small>sur 12 mois</small>
            </div>
          </template>
        </div>
      </header>

      <div class="view-toggle">
        <button
          type="button"
          :class="{ active: view === 'daily' }"
          @click="changeView('daily')"
        >
          <i class="fas fa-calendar-day"></i>
          <span class="label-long">Journalier</span>
          <span class="label-short">Jour</span>
        </button>
        <button
          type="button"
          :class="{ active: view === 'weekly' }"
          @click="changeView('weekly')"
        >
          <i class="fas fa-calendar-week"></i>
          <span class="label-long">Hebdomadaire</span>
          <span class="label-short">Semaine</span>
        </button>
        <button
          type="button"
          :class="{ active: view === 'annual' }"
          @click="changeView('annual')"
        >
          <i class="fas fa-calendar-alt"></i>
          <span class="label-long">Annuel</span>
          <span class="label-short">Année</span>
        </button>
      </div>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement de tes humeurs...</p>
      </div>

      <template v-else>
        <section v-if="view === 'daily'" class="daily-view">
          <div class="period-nav">
            <button class="nav-btn" type="button" @click="previousDay" aria-label="Jour précédent">←</button>
            <div class="period-copy">
              <span>{{ days[selectedDate.getDay()] }}</span>
              <h2>{{ formatDate(selectedDate) }}</h2>
              <small v-if="isToday(selectedDate)">Aujourd’hui</small>
            </div>
            <button
              class="nav-btn"
              type="button"
              @click="nextDay"
              :disabled="isToday(selectedDate)"
              aria-label="Jour suivant"
            >
              →
            </button>
          </div>

          <div class="day-moods">
            <article class="daily-card">
              <div class="daily-card-header">
                <div class="time-icon morning">☀️</div>
                <div>
                  <span>MATIN</span>
                  <h3>Humeur du matin</h3>
                </div>
              </div>

              <div v-if="morningMood" class="daily-mood-wrap">
                <div class="daily-mood-content">
                  <div class="daily-image">
                    <img :src="morningMood.image" :alt="morningMood.title" />
                  </div>
                  <div class="daily-copy">
                    <span v-if="morningMood.film" class="film-tag">{{ morningMood.film }}</span>
                    <h4>{{ morningMood.title }}</h4>
                    <p class="film-quote">“{{ morningMood.subtitle }}”</p>
                    <small v-if="morningMood.description && morningMood.description !== 'Aucune description fournie'" class="mood-description">
                      {{ morningMood.description }}
                    </small>
                  </div>
                </div>

                <div class="wellbeing-advice">
                  <div class="wellbeing-advice-title">
                    <span>{{ getMoodAdvice(morningMood).icon }}</span>
                    <strong>Petit conseil bien-être</strong>
                  </div>
                  <ul>
                    <li v-for="tip in getMoodAdvice(morningMood).tips" :key="tip">{{ tip }}</li>
                  </ul>
                </div>
              </div>

              <div v-else class="empty-mood">
                <span>☁️</span>
                <h4>Pas d’humeur enregistrée</h4>
                <p>Ce créneau est encore vide.</p>
              </div>
            </article>

            <article class="daily-card">
              <div class="daily-card-header">
                <div class="time-icon evening">🌙</div>
                <div>
                  <span>SOIR</span>
                  <h3>Humeur du soir</h3>
                </div>
              </div>

              <div v-if="eveningMood" class="daily-mood-wrap">
                <div class="daily-mood-content">
                  <div class="daily-image">
                    <img :src="eveningMood.image" :alt="eveningMood.title" />
                  </div>
                  <div class="daily-copy">
                    <span v-if="eveningMood.film" class="film-tag">{{ eveningMood.film }}</span>
                    <h4>{{ eveningMood.title }}</h4>
                    <p class="film-quote">“{{ eveningMood.subtitle }}”</p>
                    <small v-if="eveningMood.description && eveningMood.description !== 'Aucune description fournie'" class="mood-description">
                      {{ eveningMood.description }}
                    </small>
                  </div>
                </div>

                <div class="wellbeing-advice">
                  <div class="wellbeing-advice-title">
                    <span>{{ getMoodAdvice(eveningMood).icon }}</span>
                    <strong>Petit conseil bien-être</strong>
                  </div>
                  <ul>
                    <li v-for="tip in getMoodAdvice(eveningMood).tips" :key="tip">{{ tip }}</li>
                  </ul>
                </div>
              </div>

              <div v-else class="empty-mood">
                <span>✨</span>
                <h4>Pas d’humeur enregistrée</h4>
                <p>Ce créneau est encore vide.</p>
              </div>
            </article>
          </div>
        </section>

        <section v-else-if="view === 'weekly'" class="weekly-view">
          <div class="period-nav week-nav">
            <button class="nav-btn" type="button" @click="previousWeek" aria-label="Semaine précédente">←</button>
            <div class="period-copy">
              <span>SEMAINE</span>
              <h2>{{ formatWeekRange }}</h2>
              <small v-if="isCurrentWeek">Cette semaine</small>
            </div>
            <button
              class="nav-btn"
              type="button"
              @click="nextWeek"
              :disabled="isCurrentWeek"
              aria-label="Semaine suivante"
            >
              →
            </button>
          </div>

          <div class="week-overview">
            <article
              v-for="date in weekDates"
              :key="dateKey(date)"
              :class="['day-card', { today: isToday(date) }]"
            >
              <div class="day-card-header">
                <span>{{ shortDays[date.getDay()] }}</span>
                <strong>{{ date.getDate() }}</strong>
              </div>

              <div class="mini-period">
                <span class="mini-label">☀️ Matin</span>
                <div v-if="getMood(date, 'morning')" class="mini-mood">
                  <img
                    :src="getMood(date, 'morning').image"
                    :alt="getMood(date, 'morning').title"
                  />
                  <strong>{{ getMood(date, 'morning').title }}</strong>
                  <small
                    v-if="getMood(date, 'morning').description && getMood(date, 'morning').description !== 'Aucune description fournie'"
                    class="mini-description"
                  >
                    “{{ getMood(date, 'morning').description }}”
                  </small>
                </div>
                <div v-else class="mini-empty">—</div>
              </div>

              <div class="mini-period">
                <span class="mini-label">🌙 Soir</span>
                <div v-if="getMood(date, 'evening')" class="mini-mood">
                  <img
                    :src="getMood(date, 'evening').image"
                    :alt="getMood(date, 'evening').title"
                  />
                  <strong>{{ getMood(date, 'evening').title }}</strong>
                  <small
                    v-if="getMood(date, 'evening').description && getMood(date, 'evening').description !== 'Aucune description fournie'"
                    class="mini-description"
                  >
                    “{{ getMood(date, 'evening').description }}”
                  </small>
                </div>
                <div v-else class="mini-empty">—</div>
              </div>
            </article>
          </div>

          <div class="week-progress-card">
            <div class="progress-copy">
              <span class="tracking-kicker">TA SEMAINE EN UN COUP D’ŒIL</span>
              <h3>{{ weekTrackedSlots }} humeur{{ weekTrackedSlots > 1 ? "s" : "" }} enregistrée{{ weekTrackedSlots > 1 ? "s" : "" }}</h3>
              <p>{{ weekTrackedDays }} jour{{ weekTrackedDays > 1 ? "s" : "" }} suivi{{ weekTrackedDays > 1 ? "s" : "" }} sur 7.</p>
            </div>

            <div class="progress-bars" aria-label="Progression de la semaine">
              <div
                v-for="date in weekDates"
                :key="'bar-' + dateKey(date)"
                class="progress-day"
              >
                <span
                  class="progress-line"
                  :class="{ active: dayMoodCount(date) > 0, full: dayMoodCount(date) > 1 }"
                ></span>
                <small>{{ shortDays[date.getDay()] }}</small>
              </div>
            </div>
          </div>
        </section>

        <section v-else class="annual-view">
          <div class="period-nav year-nav">
            <button class="nav-btn" type="button" @click="previousYear" aria-label="Année précédente">←</button>
            <div class="period-copy">
              <span>ANNÉE</span>
              <h2>{{ selectedYear }}</h2>
              <small v-if="isCurrentYear">Cette année</small>
            </div>
            <button
              class="nav-btn"
              type="button"
              @click="nextYear"
              :disabled="isCurrentYear"
              aria-label="Année suivante"
            >
              →
            </button>
          </div>

          <div class="annual-chart-card">
            <div class="annual-chart-head">
              <div>
                <span class="tracking-kicker">TON ANNÉE EN UN COUP D’ŒIL</span>
                <h3>Évolution mois par mois</h3>
              </div>
              <small>{{ annualDays }} jour{{ annualDays > 1 ? "s" : "" }} suivi{{ annualDays > 1 ? "s" : "" }}</small>
            </div>

            <div class="annual-chart" aria-label="Suivi des humeurs par mois">
              <button
                v-for="month in annualMonthStats"
                :key="month.index"
                type="button"
                :class="[
                  'month-column',
                  {
                    empty: month.count === 0,
                    selected: selectedAnnualMonth === month.index
                  }
                ]"
                @click="selectedAnnualMonth = month.index"
                :aria-label="`Voir le détail de ${month.name}`"
              >
                <div class="month-bar-track">
                  <span
                    class="month-bar-fill"
                    :style="{ height: month.height }"
                  ></span>
                </div>
                <strong>{{ month.short }}</strong>
                <small>{{ month.count }}</small>
              </button>
            </div>

            <p class="annual-chart-hint">Sélectionne un mois pour voir son détail.</p>
          </div>

          <article class="annual-month-detail">
            <div class="annual-month-main">
              <div>
                <span>{{ selectedAnnualMonthData.name }}</span>
                <h3>
                  {{ selectedAnnualMonthData.count }}
                  humeur{{ selectedAnnualMonthData.count > 1 ? "s" : "" }}
                </h3>
              </div>
              <span
                class="month-dot"
                :class="{ filled: selectedAnnualMonthData.count > 0 }"
              ></span>
            </div>

            <div v-if="selectedAnnualMonthData.count > 0" class="annual-month-meta">
              <div>
                <span>Jours suivis</span>
                <strong>{{ selectedAnnualMonthData.days }}</strong>
              </div>
              <div>
                <span>Humeur la + fréquente</span>
                <strong>{{ selectedAnnualMonthData.favorite || "—" }}</strong>
              </div>
            </div>

            <p v-else class="annual-month-empty">
              Aucune humeur enregistrée pour ce mois.
            </p>
          </article>
        </section>

        <section class="share-section">
          <div class="share-copy">
            <span class="tracking-kicker">PARTAGER</span>
            <h3>Une humeur à partager ?</h3>
            <p>Envoie ton humeur du jour à tes proches en quelques secondes.</p>
          </div>

          <div class="share-actions">
            <button class="share-main" type="button" @click="toggleSocials">
              <span>Partager mon humeur</span>
              <i class="fas fa-share-alt"></i>
            </button>

            <Transition name="fade">
              <div v-if="socialsVisible" class="social-icons">
                <a :href="facebookShareLink" target="_blank" rel="noopener" aria-label="Partager sur Facebook">
                  <i class="fab fa-facebook-f"></i>
                </a>
                <a :href="twitterShareLink" target="_blank" rel="noopener" aria-label="Partager sur X">
                  <i class="fab fa-twitter"></i>
                </a>
                <a :href="linkedinShareLink" target="_blank" rel="noopener" aria-label="Partager sur LinkedIn">
                  <i class="fab fa-linkedin-in"></i>
                </a>
                <a :href="whatsappShareLink" target="_blank" rel="noopener" aria-label="Partager sur WhatsApp">
                  <i class="fab fa-whatsapp"></i>
                </a>
              </div>
            </Transition>
          </div>
        </section>
      </template>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import axios from "axios";

const view = ref("daily");
const selectedDate = ref(new Date());
const isLoading = ref(true);
const socialsVisible = ref(false);
const moodMap = ref(new Map());
const selectedAnnualMonth = ref(new Date().getMonth());

const days = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

const shortDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const monthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
const monthShortNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];

const dateKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDate = (date) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

const formatDateShort = (date) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(date);

const isToday = (date) => {
  const today = new Date();
  return dateKey(today) === dateKey(date);
};

const getMood = (date, period) =>
  moodMap.value.get(`${dateKey(date)}-${period}`) || null;

const morningMood = computed(() => getMood(selectedDate.value, "morning"));
const eveningMood = computed(() => getMood(selectedDate.value, "evening"));

const moodAdviceSets = {
  happy: {
    icon: "☀️",
    tips: [
      "Profite de ce qui te fait du bien et garde-en une petite trace.",
      "Partage cette bonne énergie avec quelqu’un que tu apprécies.",
    ],
  },
  calm: {
    icon: "🌿",
    tips: [
      "Garde ce rythme tranquille et accorde-toi une petite pause.",
      "Quelques étirements ou une courte marche peuvent prolonger cette sensation.",
    ],
  },
  neutral: {
    icon: "🌤️",
    tips: [
      "Change d’air quelques minutes pour casser la routine.",
      "Ajoute une petite chose agréable à la suite de ta journée.",
    ],
  },
  sad: {
    icon: "🤍",
    tips: [
      "Sois douce avec toi-même et allège un peu la pression si tu peux.",
      "Parler à une personne de confiance peut déjà faire du bien.",
    ],
  },
  angry: {
    icon: "🍃",
    tips: [
      "Accorde-toi quelques minutes avant de répondre ou de réagir.",
      "Bouger un peu ou respirer lentement peut aider à faire redescendre la tension.",
    ],
  },
  tired: {
    icon: "🌙",
    tips: [
      "Pense à boire, manger et faire une vraie petite pause.",
      "Garde l’essentiel et reporte ce qui peut attendre.",
    ],
  },
  stressed: {
    icon: "🌬️",
    tips: [
      "Ramène ton attention à une seule chose à la fois.",
      "Éloigne-toi de l’écran quelques minutes et ralentis ta respiration.",
    ],
  },
};

const getMoodAdvice = (mood) => {
  const value = String(mood?.title || "").toLowerCase();

  if (value.includes("heureux") || value.includes("joyeux") || value.includes("génial")) return moodAdviceSets.happy;
  if (value.includes("bien") || value.includes("calme")) return moodAdviceSets.calm;
  if (value.includes("triste") || value.includes("mal") || value.includes("pas top")) return moodAdviceSets.sad;
  if (value.includes("énerv") || value.includes("ener") || value.includes("colère") || value.includes("nul")) return moodAdviceSets.angry;
  if (value.includes("fatigu")) return moodAdviceSets.tired;
  if (value.includes("stress") || value.includes("angoiss")) return moodAdviceSets.stressed;

  return moodAdviceSets.neutral;
};

const previousDay = () => {
  const next = new Date(selectedDate.value);
  next.setDate(next.getDate() - 1);
  selectedDate.value = next;
};

const nextDay = () => {
  if (isToday(selectedDate.value)) return;
  const next = new Date(selectedDate.value);
  next.setDate(next.getDate() + 1);
  selectedDate.value = next;
};

const changeView = (newView) => {
  view.value = newView;
  socialsVisible.value = false;
};

const startOfWeek = (date) => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

const weekDates = computed(() => {
  const start = startOfWeek(selectedDate.value);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
});

const currentWeekDates = computed(() => {
  const start = startOfWeek(new Date());
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
});

const isCurrentWeek = computed(
  () => dateKey(weekDates.value[0]) === dateKey(currentWeekDates.value[0])
);

const formatWeekRange = computed(() => {
  const start = weekDates.value[0];
  const end = weekDates.value[6];
  return `${formatDateShort(start)} — ${formatDateShort(end)}`;
});

const previousWeek = () => {
  const next = new Date(selectedDate.value);
  next.setDate(next.getDate() - 7);
  selectedDate.value = next;
};

const nextWeek = () => {
  if (isCurrentWeek.value) return;
  const next = new Date(selectedDate.value);
  next.setDate(next.getDate() + 7);

  if (next > new Date()) {
    selectedDate.value = new Date();
  } else {
    selectedDate.value = next;
  }
};

const dayMoodCount = (date) =>
  Number(Boolean(getMood(date, "morning"))) + Number(Boolean(getMood(date, "evening")));

const weekTrackedSlots = computed(() =>
  weekDates.value.reduce((sum, date) => sum + dayMoodCount(date), 0)
);

const weekTrackedDays = computed(
  () => weekDates.value.filter((date) => dayMoodCount(date) > 0).length
);

const currentWeekCount = computed(() =>
  currentWeekDates.value.reduce((sum, date) => sum + dayMoodCount(date), 0)
);

const currentWeekDays = computed(
  () => currentWeekDates.value.filter((date) => dayMoodCount(date) > 0).length
);

const selectedYear = computed(() => selectedDate.value.getFullYear());
const isCurrentYear = computed(() => selectedYear.value === new Date().getFullYear());

const previousYear = () => {
  const next = new Date(selectedDate.value);
  next.setFullYear(next.getFullYear() - 1);
  selectedDate.value = next;
};

const nextYear = () => {
  if (isCurrentYear.value) return;
  const next = new Date(selectedDate.value);
  next.setFullYear(next.getFullYear() + 1);

  if (next.getFullYear() >= new Date().getFullYear()) {
    selectedDate.value = new Date();
  } else {
    selectedDate.value = next;
  }
};

const annualMonthStats = computed(() => {
  const entries = Array.from(moodMap.value.values()).filter(
    (entry) => new Date(entry.date).getFullYear() === selectedYear.value
  );

  const raw = monthNames.map((name, index) => {
    const monthEntries = entries.filter(
      (entry) => new Date(entry.date).getMonth() === index
    );
    const uniqueDays = new Set(monthEntries.map((entry) => dateKey(entry.date)));

    const titleCounts = monthEntries.reduce((acc, entry) => {
      if (entry.title) acc[entry.title] = (acc[entry.title] || 0) + 1;
      return acc;
    }, {});

    const favorite = Object.entries(titleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

    return {
      index,
      name,
      short: monthShortNames[index],
      count: monthEntries.length,
      days: uniqueDays.size,
      favorite,
    };
  });

  const maxCount = Math.max(...raw.map((month) => month.count), 1);

  return raw.map((month) => ({
    ...month,
    height: month.count === 0
      ? "8%"
      : `${Math.max(24, Math.round((month.count / maxCount) * 100))}%`,
  }));
});

const annualTotal = computed(() =>
  annualMonthStats.value.reduce((sum, month) => sum + month.count, 0)
);

const annualDays = computed(() =>
  annualMonthStats.value.reduce((sum, month) => sum + month.days, 0)
);

const annualActiveMonths = computed(
  () => annualMonthStats.value.filter((month) => month.count > 0).length
);

const selectedAnnualMonthData = computed(
  () =>
    annualMonthStats.value[selectedAnnualMonth.value] || {
      index: 0,
      name: "",
      short: "",
      count: 0,
      days: 0,
      favorite: "",
      height: "8%",
    }
);

const fetchMoodData = async () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    const moodsResponse = await axios.get(
      `https://suivi-humeurs-funes.onrender.com/api/humeurs_utilisateurs/${userId}`
    );

    const entries = Array.isArray(moodsResponse.data) ? moodsResponse.data : [];
    const uniqueEntries = new Map();

    entries.forEach((entry) => {
      const key = `${dateKey(entry.date)}-${entry.timeOfDay}`;
      const current = uniqueEntries.get(key);

      if (!current || String(entry._id) > String(current._id)) {
        uniqueEntries.set(key, entry);
      }
    });

    const hydrated = await Promise.all(
      Array.from(uniqueEntries.entries()).map(async ([key, entry]) => {
        const moodResponse = await axios.get(
          `https://suivi-humeurs-funes.onrender.com/api/humeurs/${entry.humeurId}`
        );

        return [
          key,
          {
            ...moodResponse.data,
            description: entry.description,
            date: entry.date,
            timeOfDay: entry.timeOfDay,
          },
        ];
      })
    );

    moodMap.value = new Map(hydrated);
  } catch (error) {
    if (error.response?.status === 404) {
      moodMap.value = new Map();
    } else {
      console.error("Erreur lors de la récupération des humeurs :", error);
    }
  } finally {
    isLoading.value = false;
  }
};

const toggleSocials = () => {
  socialsVisible.value = !socialsVisible.value;
};

const formattedShareText = computed(() => {
  const date = formatDate(selectedDate.value);
  const morning = morningMood.value;
  const evening = eveningMood.value;

  let text = `📅 ${date} - Mon humeur :\n`;
  text += morning
    ? `🌞 Matin : ${morning.title}\n`
    : "🌞 Matin : Pas d'humeur enregistrée\n";
  text += evening
    ? `🌙 Soir : ${evening.title}\n`
    : "🌙 Soir : Pas d'humeur enregistrée\n";

  return text;
});

const siteUrl = "https://suivi-humeurs-funes.vercel.app/";
const encodedShareText = computed(() =>
  encodeURIComponent(formattedShareText.value)
);
const fullText = computed(() =>
  encodeURIComponent(`${formattedShareText.value} ${siteUrl}`)
);

const facebookShareLink = computed(
  () =>
    `https://www.facebook.com/sharer/sharer.php?u=${siteUrl}&quote=${encodedShareText.value}`
);

const twitterShareLink = computed(
  () => `https://twitter.com/intent/tweet?text=${fullText.value}`
);

const linkedinShareLink = computed(
  () =>
    `https://www.linkedin.com/shareArticle?mini=true&url=${siteUrl}&title=Partager mon humeur&summary=${encodedShareText.value}`
);

const whatsappShareLink = computed(
  () => `https://wa.me/?text=${fullText.value}`
);

onMounted(fetchMoodData);
</script>

<style scoped>
.tracking-page {
  --brown: #2c1810;
  --brown-soft: #6b4b3e;
  --cream: #f4e4bc;
  --gold: #e9b949;
  --green: #78986a;
  min-height: 100vh;
  padding: clamp(2rem, 5vw, 4.5rem) 1rem 5rem;
  background:
    radial-gradient(circle at 10% 7%, rgba(233, 185, 73, 0.14), transparent 24%),
    radial-gradient(circle at 90% 12%, rgba(120, 152, 106, 0.1), transparent 21%),
    linear-gradient(180deg, #fffaf0 0%, #f7edcf 100%);
  color: var(--brown);
}

.tracking-shell {
  width: min(1120px, 100%);
  margin: 0 auto;
}

.tracking-hero {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  gap: 1rem;
  margin-bottom: 1.45rem;
  padding: 0.35rem 0;
  text-align: center;
}

.tracking-hero::after {
  content: "";
  position: absolute;
  left: 50%;
  top: -10px;
  width: 78px;
  height: 78px;
  border-radius: 50%;
  background: rgba(233, 185, 73, 0.12);
  transform: translateX(92px);
  pointer-events: none;
}

.tracking-kicker {
  display: inline-block;
  margin-bottom: 0.4rem;
  color: #9b6d1f;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.tracking-hero h1 {
  position: relative;
  width: fit-content;
  margin: 0 auto;
  font-family: "Sora", sans-serif;
  font-size: clamp(1.8rem, 3.2vw, 2.65rem);
  line-height: 1.08;
}

.tracking-hero > div:first-child > p {
  max-width: 560px;
  margin: 0.75rem auto 0;
  color: rgba(44, 24, 16, 0.6);
  font-size: 0.95rem;
  line-height: 1.6;
}

.summary-cards {
  width: min(390px, 100%);
  display: grid;
  grid-template-columns: repeat(2, minmax(115px, 1fr));
  gap: 0.65rem;
  margin: 0 auto;
}

.summary-card {
  min-width: 120px;
  padding: 0.85rem 0.95rem;
  border: 1px solid rgba(233, 185, 73, 0.24);
  border-radius: 17px;
  background: linear-gradient(145deg, #fff9e7, #fff2c8);
  box-shadow: 0 8px 22px rgba(44, 24, 16, 0.05);
}

.summary-card.green {
  background: linear-gradient(145deg, #eff7eb, #dfeeda);
  border-color: rgba(120, 152, 106, 0.26);
}

.summary-card span,
.summary-card strong,
.summary-card small {
  display: block;
}

.summary-card span {
  color: rgba(44, 24, 16, 0.5);
  font-size: 0.62rem;
}

.summary-card strong {
  margin: 0.12rem 0;
  font-family: "Sora", sans-serif;
  font-size: 1.35rem;
}

.summary-card small {
  display: block;
  max-width: 110px;
  overflow: hidden;
  color: rgba(44, 24, 16, 0.48);
  font-size: 0.62rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.view-toggle {
  width: fit-content;
  display: flex;
  gap: 0.25rem;
  margin: 0 auto 1.15rem;
  padding: 0.28rem;
  border: 1px solid rgba(44, 24, 16, 0.08);
  border-radius: 999px;
  background: rgba(255, 253, 248, 0.75);
}

.view-toggle button {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.64rem 0.95rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: rgba(44, 24, 16, 0.62);
  font: inherit;
  font-size: 0.73rem;
  font-weight: 700;
  cursor: pointer;
}

.view-toggle button.active {
  background: linear-gradient(135deg, #5f7f55, #78986a);
  color: #fff;
  box-shadow: 0 6px 16px rgba(95, 127, 85, 0.2);
}

.label-short {
  display: none;
}

.daily-view,
.weekly-view,
.annual-view {
  position: relative;
  overflow: hidden;
  padding: clamp(1rem, 3vw, 1.45rem);
  border: 1px solid rgba(44, 24, 16, 0.07);
  border-radius: 28px;
  background:
    radial-gradient(circle at 95% 8%, rgba(233, 185, 73, 0.12), transparent 18%),
    linear-gradient(145deg, rgba(255, 253, 248, 0.96), rgba(240, 246, 236, 0.8));
  box-shadow: 0 16px 42px rgba(44, 24, 16, 0.06);
}

.period-nav {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 42px;
  align-items: center;
  gap: 0.8rem;
  max-width: 500px;
  margin: 0 auto 1.2rem;
}

.nav-btn {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(44, 24, 16, 0.08);
  border-radius: 50%;
  background: #fffaf0;
  color: var(--brown);
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  background: #edf5e9;
}

.nav-btn:disabled {
  opacity: 0.34;
  cursor: not-allowed;
}

.period-copy {
  text-align: center;
}

.period-copy span {
  display: block;
  margin-bottom: 0.12rem;
  color: #9b6d1f;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.period-copy h2 {
  margin: 0;
  font-family: "Sora", sans-serif;
  font-size: clamp(1.05rem, 2.5vw, 1.35rem);
}

.period-copy small {
  display: block;
  margin-top: 0.18rem;
  color: var(--green);
  font-size: 0.65rem;
  font-weight: 700;
}

.day-moods {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.daily-card {
  min-width: 0;
  padding: 1rem;
  border: 1px solid rgba(120, 152, 106, 0.13);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.74);
  box-shadow: 0 8px 22px rgba(44, 24, 16, 0.035);
}

.daily-card-header {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.85rem;
}

.time-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  flex: 0 0 42px;
  border-radius: 14px;
  font-size: 1.1rem;
}

.time-icon.morning {
  background: #fff0c6;
}

.time-icon.evening {
  background: #e9eee4;
}

.daily-card-header span {
  display: block;
  margin-bottom: 0.12rem;
  color: rgba(44, 24, 16, 0.45);
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.daily-card-header h3 {
  margin: 0;
  font-family: "Sora", sans-serif;
  font-size: 0.95rem;
}

.daily-mood-wrap {
  display: grid;
  gap: 0.85rem;
}

.daily-mood-content {
  display: grid;
  grid-template-columns: minmax(120px, 42%) 1fr;
  align-items: center;
  gap: 1rem;
}

.wellbeing-advice {
  padding: 0.85rem 0.95rem;
  border: 1px solid rgba(120, 152, 106, 0.2);
  border-radius: 15px;
  background: linear-gradient(145deg, #fff8df, #edf5e9);
}

.wellbeing-advice-title {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.5rem;
}

.wellbeing-advice-title > span {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  flex: 0 0 28px;
  border-radius: 9px;
  background: #ffe59a;
  font-size: 0.9rem;
}

.wellbeing-advice-title strong {
  color: var(--brown);
  font-family: "Sora", sans-serif;
  font-size: 0.78rem;
}

.wellbeing-advice ul {
  display: grid;
  gap: 0.38rem;
  margin: 0;
  padding-left: 1.05rem;
}

.wellbeing-advice li {
  color: rgba(44, 24, 16, 0.68);
  font-family: "Sora", sans-serif;
  font-size: 0.72rem;
  line-height: 1.5;
}

.daily-image {
  height: 180px;
  overflow: hidden;
  border-radius: 17px;
  background: linear-gradient(145deg, #f4ead3, #edf3e9);
}

.daily-image img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  object-position: center;
}

.daily-copy {
  min-width: 0;
}

.film-tag {
  display: inline-block;
  max-width: 100%;
  margin-bottom: 0.4rem;
  padding: 0.28rem 0.48rem;
  overflow: hidden;
  border-radius: 999px;
  background: #edf5e9;
  color: #4f6d45;
  font-size: 0.58rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.daily-copy h4 {
  margin: 0 0 0.35rem;
  font-family: "Sora", sans-serif;
  font-size: 1.15rem;
}

.daily-copy p {
  margin: 0;
  color: rgba(44, 24, 16, 0.62);
  line-height: 1.35;
}

.daily-copy .film-quote {
  font-family: "Caveat", cursive;
  font-size: 1.08rem;
}

.daily-copy .mood-description {
  display: block;
  margin-top: 0.65rem;
  color: rgba(44, 24, 16, 0.52);
  font-family: "Sora", sans-serif;
  font-size: 0.7rem;
  line-height: 1.45;
}

.empty-mood {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(44, 24, 16, 0.46);
  text-align: center;
}

.empty-mood > span {
  font-size: 1.55rem;
}

.empty-mood h4 {
  margin: 0.55rem 0 0.2rem;
  color: var(--brown);
  font-family: "Sora", sans-serif;
  font-size: 0.85rem;
}

.empty-mood p {
  margin: 0;
  font-size: 0.7rem;
}

.week-nav {
  margin-bottom: 1.35rem;
}

.week-overview {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.55rem;
}

.day-card {
  min-width: 0;
  padding: 0.75rem 0.62rem;
  border: 1px solid rgba(44, 24, 16, 0.07);
  border-radius: 17px;
  background: rgba(255, 255, 255, 0.6);
}

.day-card.today {
  border-color: rgba(120, 152, 106, 0.55);
  background: linear-gradient(145deg, #f4f9f1, #e3efde);
  box-shadow: 0 7px 18px rgba(120, 152, 106, 0.13);
}

.day-card-header {
  margin-bottom: 0.75rem;
  text-align: center;
}

.day-card-header span {
  display: block;
  color: rgba(44, 24, 16, 0.48);
  font-size: 0.58rem;
  font-weight: 700;
}

.day-card-header strong {
  display: block;
  margin-top: 0.08rem;
  font-family: "Sora", sans-serif;
  font-size: 1rem;
}

.mini-period + .mini-period {
  margin-top: 0.65rem;
  padding-top: 0.65rem;
  border-top: 1px solid rgba(44, 24, 16, 0.06);
}

.mini-label {
  display: block;
  margin-bottom: 0.35rem;
  color: rgba(44, 24, 16, 0.46);
  font-size: 0.55rem;
}

.mini-mood {
  text-align: center;
}

.mini-mood img {
  width: 42px;
  height: 42px;
  display: block;
  margin: 0 auto 0.3rem;
  border-radius: 13px;
  background: #eef3e9;
  object-fit: contain;
  object-position: center;
}

.mini-mood strong {
  display: block;
  overflow: hidden;
  color: var(--brown);
  font-size: 0.6rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mini-description {
  display: -webkit-box;
  margin-top: 0.22rem;
  overflow: hidden;
  color: rgba(44, 24, 16, 0.48);
  font-family: "Sora", sans-serif;
  font-size: 0.52rem;
  line-height: 1.3;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.mini-empty {
  min-height: 42px;
  display: grid;
  place-items: center;
  color: rgba(44, 24, 16, 0.25);
  font-size: 0.8rem;
}

.week-progress-card {
  margin-top: 1rem;
  padding: 1rem 1.1rem 1.05rem;
  border: 1px solid rgba(233, 185, 73, 0.14);
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(255, 250, 240, 0.86), rgba(250, 246, 229, 0.9));
}

.progress-copy {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.8rem;
}

.progress-copy .tracking-kicker {
  margin-bottom: 0.2rem;
}

.progress-copy h3 {
  margin: 0;
  font-family: "Sora", sans-serif;
  font-size: 0.96rem;
}

.progress-copy p {
  margin: 0.2rem 0 0;
  color: rgba(44, 24, 16, 0.53);
  font-size: 0.68rem;
}

.progress-bars {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  align-items: end;
  gap: 0.45rem;
}

.progress-day {
  min-width: 0;
  display: grid;
  grid-template-rows: 42px auto;
  align-items: end;
  gap: 0.28rem;
  text-align: center;
}

.progress-line {
  width: 100%;
  height: 9px;
  min-height: 9px;
  align-self: end;
  border-radius: 999px;
  background: #d9d9d4;
  transition: height 0.25s ease, background 0.25s ease;
}

.progress-line.active {
  height: 24px;
  background: #8cac80;
}

.progress-line.full {
  height: 42px;
  background: #64845a;
}

.progress-day small {
  display: block;
  color: rgba(44, 24, 16, 0.48);
  font-size: 0.58rem;
  font-weight: 700;
  line-height: 1;
}

.year-nav {
  margin-bottom: 0.9rem;
}

.annual-chart-card {
  max-width: 820px;
  margin: 0 auto;
  padding: 1rem 1.05rem 0.8rem;
  border: 1px solid rgba(44, 24, 16, 0.07);
  border-radius: 19px;
  background: rgba(255, 255, 255, 0.58);
}

.annual-chart-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.65rem;
}

.annual-chart-head .tracking-kicker {
  margin-bottom: 0.15rem;
}

.annual-chart-head h3 {
  margin: 0;
  font-family: "Sora", sans-serif;
  font-size: 0.95rem;
}

.annual-chart-head > small {
  color: rgba(44, 24, 16, 0.48);
  font-size: 0.62rem;
  white-space: nowrap;
}

.annual-chart {
  height: 145px;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  align-items: end;
  gap: 0.45rem;
  padding: 0.35rem 0.15rem 0;
}

.month-column {
  min-width: 0;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto auto;
  align-items: end;
  gap: 0.22rem;
  padding: 0.2rem 0.08rem 0.28rem;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.month-column:hover,
.month-column.selected {
  background: rgba(120, 152, 106, 0.08);
}

.month-column:hover {
  transform: translateY(-2px);
}

.month-bar-track {
  width: min(22px, 70%);
  height: 96px;
  display: flex;
  align-items: flex-end;
  justify-self: center;
  overflow: hidden;
  border-radius: 999px;
  background: #e1e1dc;
}

.month-bar-fill {
  width: 100%;
  min-height: 7px;
  border-radius: inherit;
  background: linear-gradient(180deg, #8eae82, #64845a);
  transition: height 0.3s ease;
}

.month-column.empty .month-bar-fill {
  background: #cfcfca;
}

.month-column.selected .month-bar-track {
  box-shadow: 0 0 0 3px rgba(120, 152, 106, 0.13);
}

.month-column strong {
  color: rgba(44, 24, 16, 0.62);
  font-size: 0.56rem;
}

.month-column small {
  color: rgba(44, 24, 16, 0.4);
  font-size: 0.52rem;
}

.annual-chart-hint {
  margin: 0.45rem 0 0;
  color: rgba(44, 24, 16, 0.4);
  font-size: 0.58rem;
  text-align: center;
}

.annual-month-detail {
  max-width: 820px;
  margin: 0.65rem auto 0;
  padding: 0.85rem 0.95rem;
  border: 1px solid rgba(120, 152, 106, 0.17);
  border-radius: 17px;
  background: linear-gradient(145deg, rgba(244, 249, 241, 0.92), rgba(255, 250, 240, 0.8));
}

.annual-month-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.annual-month-main > div > span {
  display: block;
  margin-bottom: 0.12rem;
  color: rgba(44, 24, 16, 0.48);
  font-size: 0.62rem;
}

.annual-month-main h3 {
  margin: 0;
  font-family: "Sora", sans-serif;
  font-size: 0.95rem;
}

.month-dot {
  width: 9px;
  height: 9px;
  flex: 0 0 9px;
  margin-top: 0.2rem;
  border-radius: 50%;
  background: #d1d1cc;
}

.month-dot.filled {
  background: #78986a;
}

.annual-month-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem;
  margin-top: 0.7rem;
}

.annual-month-meta > div {
  padding-top: 0.55rem;
  border-top: 1px solid rgba(44, 24, 16, 0.06);
}

.annual-month-meta span,
.annual-month-meta strong {
  display: block;
}

.annual-month-meta span {
  color: rgba(44, 24, 16, 0.45);
  font-size: 0.58rem;
}

.annual-month-meta strong {
  margin-top: 0.12rem;
  font-size: 0.7rem;
}

.annual-month-empty {
  margin: 0.55rem 0 0;
  color: rgba(44, 24, 16, 0.5);
  font-size: 0.65rem;
}

.share-section {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
  padding: 1.05rem 1.15rem;
  border: 1px solid rgba(44, 24, 16, 0.07);
  border-radius: 20px;
  background: rgba(255, 253, 248, 0.62);
}

.share-copy h3 {
  margin: 0;
  font-family: "Sora", sans-serif;
  font-size: 0.95rem;
}

.share-copy p {
  margin: 0.25rem 0 0;
  color: rgba(44, 24, 16, 0.52);
  font-size: 0.7rem;
}

.share-actions {
  position: relative;
}

.share-main {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.75rem 0.9rem;
  border: 0;
  border-radius: 13px;
  background: var(--brown);
  color: #fff8e9;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
}

.social-icons {
  position: absolute;
  z-index: 5;
  top: calc(100% + 0.5rem);
  right: 0;
  display: flex;
  gap: 0.4rem;
  padding: 0.45rem;
  border: 1px solid rgba(44, 24, 16, 0.08);
  border-radius: 13px;
  background: #fffaf0;
  box-shadow: 0 10px 24px rgba(44, 24, 16, 0.1);
}

.social-icons a {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #edf5e9;
  color: #4f6d45;
  text-decoration: none;
}

.loading-state {
  min-height: 390px;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
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

@media (max-width: 900px) {
  .tracking-hero {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .summary-cards {
    width: min(390px, 100%);
  }

  .week-overview {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .progress-copy {
    align-items: flex-start;
  }
}

@media (max-width: 680px) {
  .tracking-page {
    padding: 0.85rem 0 2rem;
    background:
      radial-gradient(circle at 90% 3%, rgba(120, 152, 106, 0.1), transparent 18%),
      linear-gradient(180deg, #fffaf0 0%, #f8efd5 100%);
  }

  .tracking-shell {
    width: 100%;
  }

  .tracking-hero {
    display: block;
    margin: 0;
    padding: 0 0.9rem 0.7rem;
  }

  .tracking-hero::after {
    display: none;
  }

  .tracking-kicker {
    margin-bottom: 0.15rem;
    font-size: 0.56rem;
  }

  .tracking-hero h1 {
    font-size: 1.8rem;
    line-height: 1.08;
  }

  .tracking-hero > div:first-child > p {
    display: none;
  }

  .summary-cards {
    width: 100%;
    display: flex;
    gap: 0.4rem;
    margin-top: 0.65rem;
    overflow-x: auto;
    padding-bottom: 0.05rem;
    scrollbar-width: none;
  }

  .summary-cards::-webkit-scrollbar {
    display: none;
  }

  .summary-card {
    min-width: 0;
    flex: 1 1 0;
    padding: 0.5rem 0.65rem;
    border: 0;
    border-radius: 13px;
    background: rgba(255, 255, 255, 0.66);
    box-shadow: none;
  }

  .summary-card.green {
    background: rgba(228, 239, 222, 0.88);
    border: 0;
  }

  .summary-card span {
    font-size: 0.52rem;
  }

  .summary-card strong {
    margin: 0.02rem 0;
    font-size: 1rem;
  }

  .summary-card small {
    max-width: 100%;
    font-size: 0.48rem;
  }

  .view-toggle {
    position: sticky;
    top: 0.35rem;
    z-index: 10;
    width: fit-content;
    max-width: calc(100% - 1.2rem);
    margin: 0 auto 0.65rem;
    padding: 0.18rem;
    gap: 0.1rem;
    border: 0;
    border-radius: 999px;
    background: rgba(255, 251, 242, 0.95);
    box-shadow: 0 6px 18px rgba(44, 24, 16, 0.06);
    backdrop-filter: blur(10px);
  }

  .view-toggle button {
    flex: 0 0 auto;
    justify-content: center;
    gap: 0.22rem;
    padding: 0.48rem 0.62rem;
    border-radius: 999px;
    font-size: 0.6rem;
  }

  .view-toggle button i {
    font-size: 0.68rem;
  }

  .view-toggle button.active {
    background: #78986a;
    box-shadow: none;
  }

  .label-long {
    display: none;
  }

  .label-short {
    display: inline;
  }

  .daily-view,
  .weekly-view,
  .annual-view {
    padding: 0 0.75rem;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    overflow: visible;
  }

  .period-nav {
    grid-template-columns: 32px minmax(0, 1fr) 32px;
    gap: 0.35rem;
    margin: 0 auto 0.65rem;
  }

  .nav-btn {
    width: 32px;
    height: 32px;
    border: 0;
    background: rgba(255, 255, 255, 0.76);
    box-shadow: none;
    font-size: 0.8rem;
  }

  .period-copy span {
    font-size: 0.5rem;
  }

  .period-copy h2 {
    font-size: 0.96rem;
  }

  .period-copy small {
    font-size: 0.54rem;
  }

  /* Journalier : vraies lignes mobiles, proches d'une app */
  .day-moods {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .daily-card {
    width: 100%;
    min-width: 0;
    padding: 0.65rem;
    border: 0;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.78);
    box-shadow: 0 6px 18px rgba(44, 24, 16, 0.045);
  }

  .daily-card-header {
    gap: 0.45rem;
    margin-bottom: 0.45rem;
  }

  .time-icon {
    width: 31px;
    height: 31px;
    flex-basis: 31px;
    border-radius: 10px;
    font-size: 0.82rem;
  }

  .daily-card-header span {
    font-size: 0.48rem;
  }

  .daily-card-header h3 {
    font-size: 0.78rem;
  }

  .daily-mood-wrap {
    gap: 0.6rem;
  }

  .daily-mood-content {
    grid-template-columns: 76px minmax(0, 1fr);
    gap: 0.62rem;
  }

  .wellbeing-advice {
    padding: 0.7rem 0.75rem;
    border-radius: 13px;
  }

  .wellbeing-advice-title {
    margin-bottom: 0.42rem;
  }

  .wellbeing-advice-title > span {
    width: 26px;
    height: 26px;
    flex-basis: 26px;
    font-size: 0.82rem;
  }

  .wellbeing-advice-title strong {
    font-size: 0.7rem;
  }

  .wellbeing-advice ul {
    gap: 0.3rem;
    padding-left: 1rem;
  }

  .wellbeing-advice li {
    font-size: 0.66rem;
    line-height: 1.45;
  }

  .daily-image {
    height: 76px;
    border-radius: 11px;
  }

  .film-tag {
    margin-bottom: 0.18rem;
    padding: 0.18rem 0.32rem;
    font-size: 0.46rem;
  }

  .daily-copy h4 {
    margin-bottom: 0.14rem;
    font-size: 0.88rem;
  }

  .daily-copy .film-quote {
    display: -webkit-box;
    overflow: hidden;
    font-size: 0.9rem;
    line-height: 1.2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .daily-copy .mood-description {
    margin-top: 0.28rem;
    font-size: 0.58rem;
    line-height: 1.35;
  }

  .empty-mood {
    min-height: 70px;
  }

  /* Hebdo : cartes compactes comme sur la maquette */
  .week-overview {
    display: flex;
    gap: 0.48rem;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    padding: 0.05rem 0 0.35rem;
    scrollbar-width: none;
  }

  .week-overview::-webkit-scrollbar {
    display: none;
  }

  .day-card {
    min-width: 108px;
    flex: 0 0 108px;
    padding: 0.58rem 0.5rem;
    border: 1px solid rgba(44, 24, 16, 0.06);
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.68);
    box-shadow: none;
    text-align: center;
    scroll-snap-align: start;
  }

  .day-card.today {
    border-color: rgba(120, 152, 106, 0.35);
    background: #eaf2e6;
    box-shadow: none;
  }

  .day-card-header {
    margin-bottom: 0.48rem;
  }

  .day-card-header span {
    font-size: 0.5rem;
  }

  .day-card-header strong {
    font-size: 0.82rem;
  }

  .mini-period {
    min-height: auto;
    display: block;
  }

  .mini-period + .mini-period {
    margin-top: 0.45rem;
    padding-top: 0.45rem;
    border-top: 1px solid rgba(44, 24, 16, 0.05);
  }

  .mini-label {
    display: block;
    margin-bottom: 0.26rem;
    font-size: 0.48rem;
  }

  .mini-mood img {
    width: 32px;
    height: 32px;
    display: block;
    margin: 0 auto 0.2rem;
    border-radius: 9px;
  }

  .mini-mood strong {
    display: block;
    font-size: 0.5rem;
  }

  .mini-description {
    margin-top: 0.16rem;
    font-size: 0.48rem;
    line-height: 1.25;
    -webkit-line-clamp: 2;
  }

  .mini-empty {
    min-height: 32px;
    display: grid;
    place-items: center;
    font-size: 0.65rem;
  }

  .week-progress-card {
    margin-top: 0.5rem;
    padding: 0.65rem 0.7rem;
    border: 0;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.64);
  }

  .progress-copy {
    display: block;
    margin-bottom: 0.4rem;
  }

  .progress-copy .tracking-kicker {
    display: none;
  }

  .progress-copy h3 {
    font-size: 0.76rem;
  }

  .progress-copy p {
    font-size: 0.56rem;
  }

  .progress-day {
    grid-template-rows: 24px auto;
  }

  .progress-line {
    height: 7px;
    min-height: 7px;
  }

  .progress-line.active {
    height: 15px;
  }

  .progress-line.full {
    height: 24px;
  }

  .progress-day small {
    font-size: 0.46rem;
  }

  /* Annuel : bloc graphique type app + fiche du mois */
  .annual-view .year-nav {
    margin-bottom: 0.4rem;
  }

  .annual-chart-card {
    margin: 0;
    padding: 0.65rem 0.55rem 0.55rem;
    border: 0;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.7);
  }

  .annual-chart-head {
    align-items: center;
    margin-bottom: 0.28rem;
  }

  .annual-chart-head .tracking-kicker {
    display: none;
  }

  .annual-chart-head h3 {
    font-size: 0.76rem;
  }

  .annual-chart-head > small {
    font-size: 0.5rem;
  }

  .annual-chart {
    height: auto;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 0.3rem 0.14rem;
    padding: 0.12rem 0 0;
  }

  .month-column {
    height: auto;
    grid-template-rows: 40px auto auto;
    gap: 0.1rem;
    padding: 0.06rem 0 0.14rem;
    border-radius: 8px;
  }

  .month-column.selected {
    background: rgba(120, 152, 106, 0.1);
  }

  .month-bar-track {
    width: 12px;
    height: 40px;
  }

  .month-column strong {
    font-size: 0.46rem;
  }

  .month-column small {
    font-size: 0.4rem;
  }

  .annual-chart-hint {
    display: none;
  }

  .annual-month-detail {
    margin: 0.48rem 0 0;
    padding: 0.65rem 0.7rem;
    border: 0;
    border-radius: 14px;
    background: #eaf2e6;
  }

  .annual-month-main > div > span {
    font-size: 0.5rem;
  }

  .annual-month-main h3 {
    font-size: 0.8rem;
  }

  .annual-month-meta {
    gap: 0.35rem;
    margin-top: 0.45rem;
  }

  .annual-month-meta > div {
    padding-top: 0.38rem;
  }

  .annual-month-meta span {
    font-size: 0.46rem;
  }

  .annual-month-meta strong {
    font-size: 0.58rem;
  }

  .annual-month-empty {
    margin-top: 0.35rem;
    font-size: 0.54rem;
  }

  .share-section {
    width: calc(100% - 1.5rem);
    grid-template-columns: 1fr auto;
    gap: 0.5rem;
    margin: 0.55rem auto 0;
    padding: 0.62rem 0.7rem;
    border: 0;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.6);
  }

  .share-copy .tracking-kicker,
  .share-copy p {
    display: none;
  }

  .share-copy h3 {
    font-size: 0.72rem;
  }

  .share-main {
    width: 32px;
    height: 32px;
    justify-content: center;
    padding: 0;
    border-radius: 10px;
    font-size: 0.58rem;
  }

  .share-main span {
    display: none;
  }

  .social-icons {
    left: auto;
    right: 0;
  }
}

@media (max-width: 430px) {
  .tracking-hero {
    padding-inline: 0.75rem;
  }

  .tracking-hero h1 {
    font-size: 1.8rem;
  }

  .view-toggle {
    width: fit-content;
    max-width: calc(100% - 0.8rem);
  }

  .view-toggle button {
    padding-inline: 0.52rem;
    font-size: 0.55rem;
  }

  .daily-view,
  .weekly-view,
  .annual-view {
    padding-inline: 0.55rem;
  }

  .daily-mood-content {
    grid-template-columns: 70px minmax(0, 1fr);
    gap: 0.55rem;
  }

  .daily-image {
    height: 70px;
  }

  .day-card-header span {
    font-size: 0.39rem;
  }

  .day-card-header strong {
    font-size: 0.68rem;
  }

  .annual-chart {
    gap: 0.25rem 0.1rem;
  }

  .month-column {
    grid-template-rows: 37px auto auto;
  }

  .month-bar-track {
    width: 11px;
    height: 37px;
  }

  .month-column strong {
    font-size: 0.43rem;
  }

  .month-column small {
    font-size: 0.38rem;
  }
}
</style>
