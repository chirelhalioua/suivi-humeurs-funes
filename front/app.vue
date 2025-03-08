<template>
  <div class="layout">
    <!-- Navigation sticky moderne -->
    <nav class="navbar" :class="{ 'navbar-scrolled': hasScrolled }">
      <div class="navbar-container">
        <!-- Logo et titre -->
        <NuxtLink to="/" class="navbar-brand">
          <span class="brand-text">Les Humeurs à la Funès</span>
        </NuxtLink>

        <!-- Menu desktop -->
        <div class="navbar-links">
          <NuxtLink to="/" class="nav-link" active-class="nav-link-active">
            Accueil
          </NuxtLink>
          <template v-if="!isAuthenticated">
            <NuxtLink
              to="/login"
              class="nav-link"
              active-class="nav-link-active"
            >
              Connexion
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="nav-link"
              active-class="nav-link-active"
            >
              Inscription
            </NuxtLink>
          </template>
          <template v-if="isAuthenticated">
            <NuxtLink
              to="/profil"
              class="nav-link"
              active-class="nav-link-active"
            >
              Votre profil
            </NuxtLink>
            <NuxtLink
              to="/choisir-humeurs"
              class="nav-link"
              active-class="nav-link-active"
            >
              Choix des Humeurs
            </NuxtLink>
            <NuxtLink
              to="/suivi-humeurs"
              class="nav-link"
              active-class="nav-link-active"
            >
              Suivi des Humeurs
            </NuxtLink>
            <button @click="logout" class="nav-link">Déconnexion</button>
          </template>
          <NuxtLink
            to="/contact"
            class="nav-link"
            active-class="nav-link-active"
          >
            Contact
          </NuxtLink>
        </div>

        <!-- Menu burger -->
        <button
          class="menu-trigger"
          @click="toggleMenu"
          :aria-expanded="menuOpen"
        >
          <span class="menu-trigger-bar" :class="{ animate: menuOpen }"></span>
        </button>
      </div>

      <!-- Menu mobile -->
      <div class="mobile-menu" :class="{ 'is-open': menuOpen }">
        <NuxtLink to="/" class="mobile-link" @click="closeMenu">
          Accueil
        </NuxtLink>
        <template v-if="!isAuthenticated">
          <NuxtLink to="/login" class="mobile-link" @click="closeMenu">
            Connexion
          </NuxtLink>
          <NuxtLink to="/register" class="mobile-link" @click="closeMenu">
            Inscription
          </NuxtLink>
        </template>
        <template v-if="isAuthenticated">
          <NuxtLink to="/profil" class="mobile-link" @click="closeMenu">
            Votre profil
          </NuxtLink>
          <NuxtLink
            to="/choisir-humeurs"
            class="mobile-link"
            @click="closeMenu"
          >
            Choix des Humeurs
          </NuxtLink>
          <NuxtLink to="/suivi-humeurs" class="mobile-link" @click="closeMenu">
            Suivi des Humeurs
          </NuxtLink>
          <button @click="logout" class="mobile-link">Déconnexion</button>
        </template>
        <NuxtLink to="/contact" class="mobile-link" @click="closeMenu">
          Contact
        </NuxtLink>
      </div>
    </nav>

    <!-- Contenu principal -->
    <main class="main-content">
      <NuxtPage />
    </main>

    <!-- Footer moderne -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <h3 class="footer-title">À propos</h3>
            <p class="footer-text">
              Exprimez vos émotions à travers les expressions légendaires de
              Louis de Funès
            </p>
          </div>
          <div class="footer-section">
            <h3 class="footer-title">Liens rapides</h3>
            <div class="footer-links">
              <NuxtLink to="/" class="footer-link">Accueil</NuxtLink>
              <NuxtLink to="/contact" class="footer-link">Contact</NuxtLink>
            </div>
          </div>
          <div class="footer-section">
            <h3 class="footer-title">Contact</h3>
            <div class="footer-contact">
              <a href="mailto:chirelhalioua@gmail.com" class="footer-link">
                chirelhalioua@gmail.com
              </a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="copyright">© 2025 Les Humeurs à la Funès</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isAuthenticated = ref(false);  // Par défaut, on considère que l'utilisateur n'est pas connecté
const menuOpen = ref(false);
const hasScrolled = ref(false);

// Fonction pour vérifier si l'utilisateur est connecté
const checkAuthentication = () => {
  const userId = localStorage.getItem("userId");  // Vérification de la présence de l'ID utilisateur
  isAuthenticated.value = !!userId;  // Si l'ID existe, l'utilisateur est authentifié
};

const handleScroll = () => {
  hasScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  checkAuthentication();  // Vérifier si l'utilisateur est connecté au montage
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

// Fonction de déconnexion
const logout = async () => {
  localStorage.removeItem("userId");  // Suppression de l'ID utilisateur dans le localStorage
  isAuthenticated.value = false;  // Mettre à jour l'état de l'authentification
  menuOpen.value = false;
  await router.push("/login");
};

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  document.body.style.overflow = menuOpen.value ? "hidden" : "";
};

const closeMenu = () => {
  menuOpen.value = false;
  document.body.style.overflow = "";
};

router.afterEach(() => {
  closeMenu();
});
</script>

<style>
/* Le reste de votre code CSS reste inchangé */
</style>
