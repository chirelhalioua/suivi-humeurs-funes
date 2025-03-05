// Lorsque tu signes le token
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'tonSecretIci';
const token = jwt.sign(payload, secret, { expiresIn: '1h' });

// Lorsque tu vérifies le token
const token = req.headers['authorization'].split(' ')[1];  // Récupérer le token du header Authorization
try {
  const decoded = jwt.verify(token, secret);  // Vérifier avec le même secret
  req.user = decoded;  // Attacher les informations du token à la requête
  next();
} catch (error) {
  res.status(401).json({ message: 'Token invalide ou expiré.' });
}
