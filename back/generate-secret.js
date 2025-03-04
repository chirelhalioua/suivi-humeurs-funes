const jwt = require('jsonwebtoken');

// Créer un payload (données à encoder dans le token)
const payload = {
  userId: '67c7445b1283e3ae024a5800',  // L'ID utilisateur
  role: 'admin',     // Le rôle de l'utilisateur
};

// Créer un secret (assurez-vous de garder ce secret secret)
const secretKey = '67d450cc93cb72dabb8da91b998b420ecb42649c453a0dfd5ba00a9de1f1218af1b8666667da1139e046d0f29b3dd498ff31ea0a02d0d1b336c776c4a9780bff';

// Générer un token avec une expiration (par exemple, 1 heure)
const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

console.log('Voici votre token JWT :');
console.log(token);
