<style scoped>
/* Variables */
:root {
  --primary-color: #4caf50;
  --secondary-color: #2c1810;
  --background-color: #f4e4bc;
  --card-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

/* Page Layout */
.mood-tracking-page {
  min-height: 100vh;
  background-color: var(--background-color);
  padding: 20px 10px; /* Réduction du padding */
}

/* Header Styles */
.tracking-header {
  text-align: center;
  margin-bottom: 20px; /* Moins de marge */
}

.tracking-header h1 {
  font-size: 2rem; /* Taille de texte réduite */
  margin-bottom: 10px;
}

/* View Toggle */
.view-toggle {
  display: flex;
  gap: 10px; /* Moins d'espace entre les boutons */
  justify-content: center;
}

.toggle-btn {
  padding: 8px 16px; /* Boutons plus compacts */
  border-radius: 25px;
}

/* Daily View */
.daily-view {
  max-width: 800px;
  margin: 0 auto;
}

.date-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.current-date h2 {
  font-size: 1.2rem;
}

.moods-container {
  display: flex;
  gap: 10px;
}

.mood-card {
  background: white;
  border-radius: 15px;
  padding: 16px;
  box-shadow: var(--card-shadow);
}

.mood-image-container {
  width: 100px;
  height: 100px;
}

.mood-details h3 {
  font-size: 1rem;
}
</style>
