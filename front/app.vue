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

        <!-- Bouton de bascule mode sombre -->
        <button @click="toggleDarkMode" class="theme-toggle">
          {{ isDarkMode ? "☀️" : "🌙" }}
        </button>

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
const isDarkMode = ref(false); // État pour le mode sombre

// Fonction pour vérifier si l'utilisateur est connecté
const checkAuthentication = () => {
  const userId = localStorage.getItem("userId");  // Vérification de la présence de l'ID utilisateur
  isAuthenticated.value = !!userId;  // Si l'ID existe, l'utilisateur est authentifié
};

const handleScroll = () => {
  hasScrolled.value = window.scrollY > 20;
};

// Fonction pour basculer entre le mode clair et sombre
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle("dark-mode", isDarkMode.value);
  localStorage.setItem("darkMode", isDarkMode.value ? "enabled" : "disabled");
};

onMounted(() => {
  checkAuthentication();  // Vérifier si l'utilisateur est connecté au montage
  window.addEventListener("scroll", handleScroll);
  
  // Récupérer la préférence de mode sombre depuis localStorage
  isDarkMode.value = localStorage.getItem("darkMode") === "enabled";
  document.body.classList.toggle("dark-mode", isDarkMode.value);
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
/* Mode sombre */
.dark-mode {
  background-color: #1e1e1e;
  color: #ffffff;
}

.dark-mode .navbar {
  background-color: #333;
}

.dark-mode .nav-link {
  color: #ffffff;
}

.dark-mode .footer {
  background-color: #333;
}

/* Style du bouton de bascule */
.theme-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: inherit;
  margin-left: 1rem;
}

/* Reset et styles de base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Inter", sans-serif;
  line-height: 1.6;
  background-color: #f4e4bc;
}

.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navbar styles */
.navbar {
  position: sticky;
  top: 0;
  background: #2c1810;
  z-index: 1000;
  transition: all 0.3s ease;
}

.navbar-scrolled {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative; /* Ajouté pour positionner le menu correctement */
}

.navbar-brand {
  text-decoration: none;
  color: #f4e4bc;
}

.brand-text {
  font-family: "Sora", sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  transition: color 0.3s ease;
}

.navbar-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: #f4e4bc;
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 500;
  padding: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #f4e4bc;
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link-active::after {
  width: 100%;
}

/* Menu trigger */
.menu-trigger {
  display: none;
  background: none;
  border: none;
  width: 30px;
  height: 20px;
  position: absolute; /* Positionné absolument pour être dans la navbar */
  right: 10px; /* Aligné à droite avec un espacement */
  top: 50%; /* Aligné verticalement */
  transform: translateY(-50%); /* Centré verticalement */
  cursor: pointer;
}

.menu-trigger-bar {
  position: absolute;
  width: 50%;
  height: 2px;
  background-color: #f4e4bc;
  transition: all 0.3s ease;
}

.menu-trigger-bar::before,
.menu-trigger-bar::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #f4e4bc;
  transition: all 0.3s ease;
}

.menu-trigger-bar::before {
  top: -8px;
}

.menu-trigger-bar::after {
  bottom: -8px;
}

.menu-trigger-bar.animate {
  transform: rotate(45deg);
}

.menu-trigger-bar.animate::before {
  top: 0;
  transform: rotate(90deg);
}

.menu-trigger-bar.animate::after {
  bottom: 0;
  transform: rotate(90deg);
}

/* Mobile menu */
.mobile-menu {
  display: none;
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #2c1810;
  padding: 2rem;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.mobile-menu.is-open {
  transform: translateX(0);
}

.mobile-link {
  display: block;
  color: #f4e4bc;
  text-decoration: none;
  padding: 1rem;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.mobile-link:hover {
  background-color: rgba(244, 228, 188, 0.1);
}

/* Main content */
.main-content {
  flex: 1;
}

/* Footer styles */
.footer {
  background-color: #2c1810;
  color: #f4e4bc;
  padding: 4rem 1rem 2rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-title {
  font-family: "Sora", sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.footer-text {
  line-height: 1.6;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-link {
  color: #f4e4bc;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: white;
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(244, 228, 188, 0.2);
  text-align: center;
}

.copyright {
  font-size: 0.875rem;
}

/* Responsive styles */
@media (max-width: 768px) {
  .navbar-links {
    display: none;
  }

  .menu-trigger {
    display: block;
  }

  .mobile-menu {
    display: block;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer {
    padding: 2rem 1rem;
  }
}

/* Transitions de page */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
