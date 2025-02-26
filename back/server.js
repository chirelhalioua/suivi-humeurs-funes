const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");

// Importation des routes
const humeursRoutes = require("./routes/humeursRoutes");
const authRoutes = require("./routes/authRoutes");
const humeursUserRoute = require("./routes/humeursUser");
const authMiddleware = require("./middleware/authMiddleware");  
const { getUserProfile } = require("./controllers/authController");  

// Charger les variables d'environnement
dotenv.config();
console.log("🔍 MONGO_URI:", process.env.MONGODB_URI);

// Vérification des variables d'environnement
if (!process.env.MONGODB_URI) {
  console.error("❌ Erreur : la variable d'environnement MONGODB_URI n'est pas définie.");
  process.exit(1); // Arrête le serveur si MONGO_URI n'est pas défini
}

// Initialisation de l'application Express
const app = express();

// Configuration dynamique de CORS
const corsOptions = {
  origin: process.env.NODE_ENV === "production"
    ? "https://suivi-humeurs-funes.vercel.app"
    : "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions)); // Appliquer CORS

// Middleware pour analyser les requêtes
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Connexion à MongoDB avec gestion d'erreur
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch(err => {
    console.error("❌ Erreur de connexion MongoDB :", err);
    process.exit(1); 
  });

// Routes principales
app.use("/api/auth", authRoutes);
console.log("✅ Routes auth chargées");

app.use("/api", humeursUserRoute);
console.log("✅ Routes humeursUser chargées");

app.use("/api/humeurs", humeursRoutes);
console.log("✅ Routes humeurs chargées");

// Route pour tester si le backend fonctionne
app.get("/", (req, res) => {
  res.send("✅ API opérationnelle !");
});

// Route protégée pour obtenir le profil de l'utilisateur connecté
app.get("/api/profil", authMiddleware, getUserProfile);

// Liste des routes disponibles
console.log("📌 Routes disponibles :");
console.table(listEndpoints(app));

// Middleware global pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error("❌ Erreur détectée :", err.stack);
  res.status(500).json({ message: "Erreur interne du serveur." });
});

// Démarrage du serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});
