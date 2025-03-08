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

// Récupérer le profil de l'utilisateur (sans token, par userId dans la query)
router.get('/profil', (req, res) => {
  const userId = req.query.userId; // Récupérer l'userId depuis les paramètres de la requête

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // Logique pour récupérer le profil de l'utilisateur depuis la base de données
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ user });
    })
    .catch(err => res.status(500).json({ message: 'Server error' }));
});

module.exports = router;
