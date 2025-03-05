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

// Authentification via Google (connexion et inscription)
const googleAuth = async (req, res) => {
  const { token } = req.body;

  try {
    // Vérifier le token Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Rechercher un utilisateur existant avec l'email fourni par Google
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      // Si l'utilisateur n'existe pas, le créer
      user = new User({
        name: payload.name,
        email: payload.email,
        password: '', // Aucun mot de passe n'est requis pour une connexion Google
        avatar: payload.picture // Si votre modèle User possède un champ "avatar"
      });
      await user.save();
    }

    res.status(200).json({ userId: user._id }); // Retourne uniquement l'ID de l'utilisateur
  } catch (error) {
    console.error("Erreur lors de l'authentification Google :", error);
    res.status(400).json({ message: "Échec de l'authentification avec Google" });
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

// Récupérer le profil de l'utilisateur connecté
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil : ', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Mettre à jour le profil de l'utilisateur connecté
const updateUserProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.status(200).json({ message: 'Profil mis à jour', user });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil : ', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Supprimer le profil de l'utilisateur
const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Profil supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du profil : ', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Exporter les fonctions du contrôleur
module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
};
