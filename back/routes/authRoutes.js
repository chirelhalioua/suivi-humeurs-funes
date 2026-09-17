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

// Supprimer uniquement la photo de profil
router.delete("/profil/:userId/photo", async (req, res) => {
  const { userId } = req.params;

  if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
    return res.status(400).json({ message: "Utilisateur invalide." });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: '' },
      { new: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    return res.status(200).json({
      message: "Photo de profil supprimée.",
      user,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la photo :", error);
    return res.status(500).json({ message: "Erreur du serveur." });
  }
});

// Supprimer un profil utilisateur
router.delete("/profil/:userId", deleteUserProfile);

module.exports = router;
