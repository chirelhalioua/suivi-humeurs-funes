const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  getUserProfile, 
  deleteUserProfile,  
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

// Récupérer tous les utilisateurs
router.get('/users', getAllUsers);

// Récupérer le profil de l'utilisateur connecté (route protégée)
router.get('/profil', authMiddleware, getUserProfile);

// Suppression du profil de l'utilisateur connecté (protégé)
router.delete('/profil', authMiddleware, deleteUserProfile);

module.exports = router;
