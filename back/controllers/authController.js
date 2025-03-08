const User = require('../models/User');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { OAuth2Client } = require('google-auth-library');

// Initialisation du client Google avec l'ID client défini dans les variables d'environnement
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Inscription d'un nouvel utilisateur
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Email invalide' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Le mot de passe doit comporter au moins 6 caractères' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: `L'email ${email} est déjà utilisé` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    const savedUser = await user.save();

    res.status(201).json({ userId: savedUser._id }); // Retourne uniquement l'ID de l'utilisateur
  } catch (error) {
    console.error("Erreur lors de l'inscription : ", error);
    res.status(500).json({ message: 'Erreur du serveur lors de l\'inscription' });
  }
};

// Connexion d'un utilisateur
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Email invalide' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    res.status(200).json({ userId: user._id }); // Retourne uniquement l'ID de l'utilisateur
  } catch (error) {
    console.error('Erreur lors de la connexion : ', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    if (users.length === 0) {
      return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
    }
    res.status(200).json({ users });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs : ', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Récupérer le profil d'un utilisateur spécifique
const getUserProfile = async (req, res) => {
  const { userId } = req.query; // On récupère l'ID de l'utilisateur depuis la requête

  if (!userId) {
    return res.status(400).json({ message: 'L\'ID de l\'utilisateur est requis' });
  }

  try {
    const user = await User.findById(userId).select('-password'); // On exclut le mot de passe
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil : ', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Supprimer un profil utilisateur
const deleteUserProfile = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'L\'ID de l\'utilisateur est requis pour la suppression' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await User.findByIdAndDelete(userId); // Suppression de l'utilisateur
    res.status(200).json({ message: 'Profil utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du profil : ', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserProfile,
  deleteUserProfile,
};
