<template>
  <div class="contact-page">
    <div class="contact-container">
      <!-- Section Contact -->
      <section class="contact-section">
        <h1 class="section-title">Contactez-nous</h1>
        <p class="section-subtitle">
          Nous sommes là pour vous aider et répondre à vos questions
        </p>

        <div class="contact-cards">
          <!-- Email -->
          <div class="contact-card">
            <div class="card-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <h3>Email</h3>
            <p>Envoyez-nous un email</p>
            <a href="mailto:chirelhalioua@gmail.com" class="contact-link">
              chirelhalioua@gmail.com
            </a>
          </div>

          <!-- Support -->
          <div class="contact-card">
            <div class="card-icon">
              <i class="fas fa-headset"></i>
            </div>
            <h3>Support</h3>
            <p>Consultez notre FAQ</p>
            <button class="scroll-to-faq" @click="scrollToFaq">
              Voir la FAQ
            </button>
          </div>
        </div>
      </section>

      <!-- Section FAQ -->
      <section class="faq-section" ref="faqSection">
        <h2 class="section-title">Questions Fréquentes</h2>
        <div class="faq-grid">
          <div
            v-for="(item, index) in faqItems"
            :key="index"
            class="faq-item"
            :class="{ active: item.isOpen }"
          >
            <button
              @click="toggleAccordion(index)"
              class="faq-question"
              :aria-expanded="item.isOpen"
            >
              <span>{{ item.question }}</span>
              <i class="fas" :class="item.isOpen ? 'fa-minus' : 'fa-plus'"></i>
            </button>
            <Transition
              name="fade"
              @enter="startTransition"
              @leave="endTransition"
            >
              <div v-show="item.isOpen" class="faq-answer">
                <p>{{ item.answer }}</p>
              </div>
            </Transition>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const faqSection = ref(null);
const faqItems = ref([
  {
    question: "Comment m'inscrire ?",
    answer:
      "Pour vous inscrire, cliquez sur le bouton 'S'inscrire' sur la page d'accueil ou dans le menu Inscription et suivez les étapes indiquées.",
    isOpen: false,
  },
  {
    question: "Comment me connecter ?",
    answer:
      "Pour vous connecter, cliquez sur le lien Connexion dans le menu et utilisez votre adresse e-mail et votre mot de passe.",
    isOpen: false,
  },
  {
    question: "Puis-je supprimer mon profil ?",
    answer:
      "Oui, vous pouvez supprimer votre profil dans les paramètres de votre compte en sélectionnant l'option 'Supprimer mon compte'.",
    isOpen: false,
  },
  {
    question: "Comment choisir une humeur ?",
    answer:
      "Vous pouvez choisir une humeur en cliquant sur le lien Choix des Humeurs dans le menu ou depuis votre profil.",
    isOpen: false,
  },
  {
    question: "De quelle heure à quelle heure puis-je choisir mon humeur ?",
    answer: "Le matin de 6h à 13h et le soir de 17h à minuit.",
    isOpen: false,
  },
  {
    question: "Combien de fois puis-je choisir mon humeur ?",
    answer:
      "Vous pouvez choisir votre humeur 2 fois par jour, le matin et le soir, selon les horaires indiquées ci-dessus.",
    isOpen: false,
  },
  {
    question: "Comment suivre mes humeurs ?",
    answer:
      "Vous pouvez suivre vos humeurs dans votre historique accessible depuis le lien dans le menu : Suivi des Humeurs ou depuis votre profil.",
    isOpen: false,
  },
]);

const toggleAccordion = (index) => {
  faqItems.value = faqItems.value.map((item, i) => ({
    ...item,
    isOpen: i === index ? !item.isOpen : false,
  }));
};

const scrollToFaq = () => {
  faqSection.value?.scrollIntoView({ behavior: "smooth" });
};

const startTransition = (el) => {
  el.style.height = "auto";
  const height = el.offsetHeight;
  el.style.height = "0";
  el.offsetHeight; // Force reflow
  el.style.height = height + "px";
};

const endTransition = (el) => {
  el.style.height = "0";
};
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background-color: #f4e4bc;
  padding: 40px 20px;
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-family: "Sora", sans-serif;
  font-size: 36px;
  font-weight: bold;
  color: #2c1810;
  text-align: center;
  margin-bottom: 16px;
}

.section-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 48px;
  font-size: 18px;
}

/* Contact Cards */
.contact-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-bottom: 64px;
}

.contact-card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-5px);
}

.card-icon {
  width: 64px;
  height: 64px;
  background: #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.card-icon i {
  font-size: 24px;
  color: white;
}

.contact-card h3 {
  font-family: "Sora", sans-serif;
  font-size: 24px;
  color: #2c1810;
  margin-bottom: 12px;
}

.contact-card p {
  color: #666;
  margin-bottom: 16px;
}

.contact-link {
  color: #4caf50;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #45a049;
  text-decoration: underline;
}

.scroll-to-faq {
  background: #4caf50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.scroll-to-faq:hover {
  background: #45a049;
  transform: translateY(-2px);
}

/* FAQ Section */
.faq-section {
  margin-top: 64px;
}

.faq-grid {
  display: grid;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.faq-question {
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #2c1810;
  transition: all 0.3s ease;
}

.faq-question:hover {
  background: #f8f8f8;
}

.faq-question i {
  font-size: 14px;
  color: #4caf50;
  transition: transform 0.3s ease;
}

.faq-item.active .faq-question {
  background: #f8f8f8;
}

.faq-answer {
  overflow: hidden;
  transition: height 0.3s ease;
}

.faq-answer p {
  padding: 20px;
  color: #666;
  line-height: 1.6;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  height: 0;
}

/* Media Queries */
@media (max-width: 768px) {
  .section-title {
    font-size: 28px;
  }

  .contact-cards {
    grid-template-columns: 1fr;
  }

  .faq-question {
    font-size: 14px;
    padding: 16px;
  }

  .faq-answer p {
    padding: 16px;
    font-size: 14px;
  }
}
</style>
