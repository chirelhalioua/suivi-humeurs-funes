const User = require('../models/User');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const mongoose = require('mongoose');
const crypto = require('crypto');
const https = require('https');

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

// Supprimer le profil
const deleteUserProfile = async (req, res) => {
  console.log("📥 Params reçus :", req.params); // Debugging

  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "L'ID de l'utilisateur est requis pour la suppression" });
  }

  // Vérification du format MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Format d'ID invalide" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await User.findByIdAndDelete(userId);
    return res.status(200).json({ message: "Profil utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};


// Envoyer un email transactionnel via Brevo sans dépendance supplémentaire
const sendResetEmail = (to, resetUrl) => {
  return new Promise((resolve, reject) => {
    const brevoApiKey = String(process.env.BREVO_API_KEY || '').trim();
    const mailFrom = String(process.env.MAIL_FROM || 'contact@chirelhalioua.fr').trim();

    if (!brevoApiKey) {
      return reject(new Error('BREVO_API_KEY manquante'));
    }

    const payload = JSON.stringify({
      sender: {
        name: 'Les Humeurs à la Funès',
        email: mailFrom
      },
      to: [{ email: to }],
      subject: 'Réinitialisation de votre mot de passe',
      htmlContent: `
        <div style="font-family:Arial,sans-serif;color:#2c1810;line-height:1.6">
          <h2>Réinitialisation du mot de passe</h2>
          <p>Vous avez demandé à modifier votre mot de passe.</p>
          <p>
            <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#2c1810;color:#fff8e9;text-decoration:none;border-radius:999px;font-weight:700">
              Choisir un nouveau mot de passe
            </a>
          </p>
          <p>Ce lien est valable pendant 15 minutes.</p>
          <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
          <p style="font-size:12px;color:#7a655d">Pensez à vérifier vos courriers indésirables si besoin.</p>
        </div>
      `
    });

    const req = https.request({
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(payload)
      }
    }, (response) => {
      let body = '';
      response.on('data', chunk => body += chunk);
      response.on('end', () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(body);
        } else {
          reject(new Error(`Brevo a répondu ${response.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
};

// Demander un lien de réinitialisation
const requestPasswordReset = async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Veuillez saisir une adresse email valide.' });
  }

  try {
    const user = await User.findOne({ email });

    // Même réponse si l'adresse n'existe pas afin de ne pas révéler les comptes inscrits.
    if (!user) {
      return res.status(200).json({
        message: 'Si cette adresse est associée à un compte, un email de réinitialisation vient d’être envoyé.'
      });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const frontendUrl = (process.env.FRONTEND_URL || 'https://suivi-humeurs-funes.vercel.app').replace(/\/$/, '');
    const resetUrl = `${frontendUrl}/new-password?token=${encodeURIComponent(rawToken)}`;

    try {
      await sendResetEmail(user.email, resetUrl);
    } catch (emailError) {
      // Ne pas laisser un token actif si l'envoi a échoué.
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      console.error('Erreur lors de l’envoi de l’email de réinitialisation :', emailError);
      return res.status(500).json({
        message: 'L’email n’a pas pu être envoyé pour le moment. Réessayez dans quelques instants.'
      });
    }

    return res.status(200).json({
      message: 'Un email de réinitialisation a été envoyé. Vérifiez aussi vos spams.'
    });
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation :', error);
    return res.status(500).json({ message: 'Erreur du serveur.' });
  }
};

// Enregistrer le nouveau mot de passe à partir du token reçu par email
const confirmPasswordReset = async (req, res) => {
  const token = String(req.body.token || '');
  const password = String(req.body.password || '');

  if (!token) {
    return res.status(400).json({ message: 'Lien de réinitialisation invalide.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Le mot de passe doit comporter au moins 6 caractères.' });
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Ce lien est invalide ou a expiré. Demandez un nouveau lien.' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({ message: 'Votre mot de passe a bien été modifié.' });
  } catch (error) {
    console.error('Erreur lors de la confirmation de réinitialisation :', error);
    return res.status(500).json({ message: 'Erreur du serveur.' });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserProfile,
  deleteUserProfile,
  requestPasswordReset,
  confirmPasswordReset,
};
