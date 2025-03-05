const jwt = require('jsonwebtoken');

// Exemple de fonction de login avec récupération de l'utilisateur
app.post('/login', async (req, res) => {
  // Récupère l'utilisateur de la base de données en fonction de l'email et mot de passe
  const user = await getUserFromDatabase(req.body.email, req.body.password);

  if (!user) {
    return res.status(400).json({ message: 'Utilisateur ou mot de passe incorrect' });
  }

  // Créer un payload dynamique avec l'ID et le rôle de l'utilisateur récupéré
  const payload = {
    id: user._id,  // Utilisateur récupéré dans la base de données
    role: user.role,  // Récupérer le rôle de l'utilisateur (admin, user, etc.)
  };

  // Clé secrète pour signer le token (assurez-vous que `JWT_SECRET` est défini dans votre environnement)
  const secretKey = process.env.JWT_SECRET;

  // Générer un token avec une expiration (par exemple, 1 heure)
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

  // Retourner le token au frontend
  res.json({ token });
});
