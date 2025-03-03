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
          <p>
            Cette action est irréversible. Toutes vos données seront
            définitivement supprimées.
          </p>
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

const fetchUserProfile = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const response = await axios.get("https://suivi-humeurs-funes.onrender.com/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data?.user) {
      user.value = response.data.user;
      console.log("Profil chargé:", user.value);
    } else {
      throw new Error("Profil non trouvé");
    }
  } catch (error) {
    console.error("Erreur:", error);
    router.push("/login");
  } finally {
    isLoading.value = false;
  }
};

const logout = () => {
  localStorage.removeItem("authToken");
  router.push("/login");
};

const goToHumeursChoice = () => router.push("/choisir-humeurs");
const goToMoodTracking = () => router.push("/suivi-humeurs");
const confirmDelete = () => (showConfirmDelete.value = true);
const cancelDelete = () => (showConfirmDelete.value = false);

const deleteProfile = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    await axios.delete("https://suivi-humeurs-funes.onrender.com/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    localStorage.removeItem("authToken");
    router.push("/login");
  } catch (error) {
    console.error("Erreur:", error);
    alert("Une erreur est survenue lors de la suppression du profil.");
  }
};

onMounted(fetchUserProfile);
</script>

<style scoped>
/* Variables */
:root {
  --primary-color: #4caf50;
  --danger-color: #dc3545;
  --text-color: #2c1810;
  --bg-color: #f4e4bc;
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
  transition: all 0.3s ease;
}

.logout-btn {
  background-color: #f8f9fa;
  color: #666;
}

.logout-btn:hover {
  background-color: #e9ecef;
}

.delete-btn {
  background-color: var(--danger-color);
  color: white;
  display: flex;
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

.modal-actions {
  display: flex;
  gap: 15px;
}

.cancel-btn {
  background-color: #f8f9fa;
  color: #666;
}

.confirm-btn {
  background-color: var(--danger-color);
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-actions {
    flex-direction: column;
  }
}
</style>
