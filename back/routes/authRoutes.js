const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  getUserProfile, 
  deleteUserProfile,
  updateProfileImage,
  changePassword,
  requestPasswordReset,
  confirmPasswordReset,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// Inscription
router.post('/register', (req, res) => {
  console.log('Requête reçue sur /register');
  registerUser(req, res);
});

// Connexion classique
router.post('/login', loginUser);

// Réinitialisation du mot de passe
router.post('/reset-password', requestPasswordReset);
router.post('/reset-password/confirm', confirmPasswordReset);

// Récupérer tous les utilisateurs
router.get('/users', getAllUsers);

// Récupérer le profil de l'utilisateur (sans token, par userId dans la query)
router.get('/profil', getUserProfile);

// Modifier la photo et le mot de passe depuis le profil connecté
router.put("/profil/:userId/photo", updateProfileImage);
router.put("/profil/:userId/password", changePassword);

// Supprimer un profil utilisateur
router.delete("/profil/:userId", deleteUserProfile);

module.exports = router;
