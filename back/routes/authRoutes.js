const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  getUserProfile, 
  deleteUserProfile, 
  googleAuth 
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

// Profil de l'utilisateur (protégé)
router.get('/profile', authMiddleware, (req, res) => {
  console.log('Route /profile atteinte avec utilisateur :', req.user);
  res.send('Profil trouvé');
});

// Récupérer tous les utilisateurs
router.get('/users', getAllUsers);

// Suppression du profil de l'utilisateur connecté
router.delete('/profile', authMiddleware, deleteUserProfile);

// Endpoint pour récupérer les données de l'utilisateur connecté
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send('Utilisateur non trouvé.');
    res.json(user);
  } catch (error) {
    res.status(500).send('Erreur serveur.');
  }
});

// Route pour l'authentification avec Google
router.post('/google', googleAuth);

module.exports = router;
