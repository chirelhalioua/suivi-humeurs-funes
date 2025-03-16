<template>
  <div class="profile-page">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement de votre profil...</p>
    </div>

    <!-- Profile Content -->
    <div v-else-if="user" class="profile-container">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-avatar">
          {{ user.name.charAt(0).toUpperCase() }}
        </div>
        <h1>Bienvenue, {{ user.name }} !</h1>
      </div>

      <!-- Profile Info Card -->
      <div class="info-card">
        <div class="info-item">
          <i class="fas fa-user"></i>
          <div class="info-content">
            <label>Nom et Prénom</label>
            <p>{{ user.name }}</p>
          </div>
        </div>
        <div class="info-item">
          <i class="fas fa-envelope"></i>
          <div class="info-content">
            <label>Email</label>
            <p>{{ user.email }}</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-cards">
        <button class="action-card" @click="goToHumeursChoice">
          <i class="fas fa-smile"></i>
          <span>Choix des Humeurs</span>
        </button>
        <button class="action-card" @click="goToMoodTracking">
          <i class="fas fa-chart-line"></i>
          <span>Suivi des Humeurs</span>
        </button>
      </div>

      <!-- Account Actions -->
      <div class="account-actions">
        <button class="logout-btn" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
          <span>Se déconnecter</span>
        </button>
        <button class="delete-btn" @click="confirmDelete">
          <i class="fas fa-trash-alt"></i>
          <span>Supprimer le profil</span>
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Transition name="modal">
      <div v-if="showConfirmDelete" class="modal-overlay" @click="cancelDelete">
        <div class="modal-content" @click.stop>
          <div class="modal-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h2>Supprimer le profil ?</h2>
          <p>Cette action est irréversible. Toutes vos données seront définitivement supprimées.</p>
          <div class="modal-actions">
            <button class="cancel-btn" @click="cancelDelete">
              <i class="fas fa-times"></i>
              Annuler
            </button>
            <button class="confirm-btn" @click="deleteProfile">
              <i class="fas fa-trash-alt"></i>
              Confirmer la suppression
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref(null);
const isLoading = ref(true);
const showConfirmDelete = ref(false);

// Fonction pour récupérer les informations du profil
const fetchUserProfile = async () => {
  const userId = localStorage.getItem("userId"); // Récupérer l'ID utilisateur depuis localStorage
  if (!userId) {
    router.push("/login"); // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    return;
  }

  try {
    const response = await axios.get(`https://suivi-humeurs-funes.onrender.com/api/auth/profil`, {
      params: { userId } // Passer l'ID utilisateur en paramètre
    });

    if (response.data?.user) {
      user.value = response.data.user; // Mettre à jour le profil de l'utilisateur
    } else {
      throw new Error("Profil non trouvé");
    }
  } catch (error) {
    console.error("Erreur:", error);
    router.push("/login"); // Rediriger vers la page de connexion en cas d'erreur
  } finally {
    isLoading.value = false;
  }
};


// Fonction pour se déconnecter
const logout = () => {
  localStorage.removeItem("userId");
  router.push("/login");
};

// Fonction pour naviguer vers le choix des humeurs
const goToHumeursChoice = () => router.push("/choisir-humeurs");

// Fonction pour naviguer vers le suivi des humeurs
const goToMoodTracking = () => router.push("/suivi-humeurs");

// Fonction pour afficher la confirmation de suppression
const confirmDelete = () => (showConfirmDelete.value = true);

// Fonction pour annuler la suppression
const cancelDelete = () => (showConfirmDelete.value = false);

// Fonction pour supprimer le profil
const deleteProfile = async () => {
  const userId = localStorage.getItem("userId");
  console.log("🔍 UserID utilisé pour la suppression :", userId);

  if (!userId) {
    console.error("❌ Aucun userId trouvé !");
    alert("Erreur : Aucun utilisateur trouvé !");
    return;
  }

  try {
    const response = await axios.delete(`https://suivi-humeurs-funes.onrender.com/api/auth/profil/${userId}`);
    console.log("✅ Profil supprimé avec succès", response.data);

    // Suppression réussie → Nettoyage et redirection
    localStorage.removeItem("userId");
    router.push("/login");
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du profil :", error.response?.data || error);
    alert(`Erreur : ${error.response?.data?.message || "Échec de la suppression"}`);
  }
};

// Récupérer le profil lors du montage du composant
onMounted(fetchUserProfile);
</script>

<style scoped>
/* Variables */
:root {
  --primary-color: #4caf50;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --text-color: #2c1810;
  --bg-color: #f4e4bc;
  --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

/* Page Layout */
.profile-page {
  min-height: 100vh;
  background-color: var(--bg-color);
  padding: 40px 20px;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease;
}

/* Profile Header */
.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #4caf50, #45a049);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
  margin: 0 auto 20px;
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
}

.profile-header h1 {
  font-family: "Sora", sans-serif;
  color: var(--text-color);
  font-size: 2rem;
  margin: 0;
}

/* Info Card */
.info-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: var(--card-shadow);
}

.info-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.info-item:last-child {
  border-bottom: none;
}

.info-item i {
  font-size: 24px;
  color: var(--primary-color);
  width: 40px;
}

.info-content {
  margin-left: 15px;
}

.info-content label {
  font-size: 0.9rem;
  color: #666;
  display: block;
  margin-bottom: 4px;
}

.info-content p {
  font-size: 1.1rem;
  color: var(--text-color);
  margin: 0;
}

/* Action Cards */
.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.action-card {
  background: white;
  border: none;
  border-radius: 16px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--card-shadow);
}

.action-card i {
  font-size: 32px;
  color: var(--primary-color);
}

.action-card span {
  font-size: 1.1rem;
  color: var(--text-color);
  font-weight: 500;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

/* Account Actions */
.account-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.logout-btn,
.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.logout-btn {
  background-color: #f8f9fa;
  color: #666;
}

.logout-btn:hover {
  background-color: #e9ecef;
}

.delete-btn {
  background-color: red;
  color: white;
}

.delete-btn:hover {
  background-color: #f9837a;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.modal-icon {
  font-size: 48px;
  color: var(--warning-color);
  margin-bottom: 20px;
}

.modal-content h2 {
  color: var(--text-color);
  margin-bottom: 15px;
}

.modal-content p {
  color: #666;
  margin-bottom: 25px;
}

.modal-actions {
  display: flex;
  gap: 15px;
}

.modal-actions button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: var(--transition);
}

.cancel-btn {
  background-color: #f8f9fa;
  color: #666;
}

.confirm-btn {
  background-color: #FF0000;
  color: white;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
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

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-container {
    padding: 20px;
  }

  .action-cards {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
