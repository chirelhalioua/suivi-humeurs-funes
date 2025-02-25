const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");

// Importation des routes
const humeursRoutes = require("./routes/humeursRoutes");
const authRoutes = require("./routes/authRoutes");
const humeursUserRoute = require("./routes/humeursUser");
const authMiddleware = require("./middleware/authMiddleware");  // Import du middleware d'authentification
const { getUserProfile } = require("./controllers/authController");  // Import du contrôleur pour obtenir le profil


// Charger les variables d'environnement
dotenv.config();
console.log("MONGO_URI:", process.env.MONGODB_URI);


// Vérification des variables d'environnement
if (!process.env.MONGODB_URI) {
  console.error("Erreur : la variable d'environnement MONGO_URI n'est pas définie.");
  process.exit(1); // Arrête le serveur si MONGO_URI n'est pas défini
}

// Initialisation de l'application Express
const app = express();

// Configuration dynamique de CORS
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["http://localhost:3000/", "https://suivi-humeurs.vercel.app/"]
      : "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions)); // Appliquer CORS

// Middleware pour analyser les requêtes
app.use(express.json()); // Analyse les requêtes avec un payload JSON
app.use(express.urlencoded({ extended: true })); // Analyse les requêtes URL-encoded

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })



// Routes principales
app.use("/api/auth", authRoutes);
app.use("/api", humeursUserRoute);
app.use("/api/humeurs", humeursRoutes);

// Liste des routes disponibles
console.log("Routes disponibles :");
console.table(listEndpoints(app)); // Affichage des routes sous forme de table pour plus de lisibilité

// Route protégée pour obtenir le profil de l'utilisateur connecté
app.get("/api/profil", authMiddleware, getUserProfile);

// Middleware global pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error("Erreur détectée :", err.stack);
  res.status(500).json({ message: "Erreur interne du serveur." });
});

// Démarrage du serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
