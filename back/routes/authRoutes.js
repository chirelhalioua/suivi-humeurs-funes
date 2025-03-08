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

// Récupérer le profil de l'utilisateur connecté (protégé)
router.get('/profil', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send('Utilisateur non trouvé.');
    res.json(user);
  } catch (error) {
    res.status(500).send('Erreur serveur.');
  }
});

// Récupérer un profil via son ID
router.get('/profil/:userId', getUserProfile);

// Suppression du profil de l'utilisateur connecté (protégé)
router.delete('/profil', authMiddleware, deleteUserProfile);

module.exports = router;
