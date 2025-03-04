const jwt = require('jsonwebtoken');

// Créer un payload (données à encoder dans le token)
const payload = {
  userId: '67c7445b1283e3ae024a5800',  // L'ID utilisateur
  role: 'admin',     // Le rôle de l'utilisateur
};

// Créer un secret (assurez-vous de garder ce secret secret)
const secretKey = process.env.JWT_SECRET;

// Générer un token avec une expiration (par exemple, 1 heure)
const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

console.log('Voici votre token JWT :');
console.log(token);
