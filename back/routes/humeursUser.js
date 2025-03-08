const express = require('express');
const router = express.Router();
const HumeurUser = require('../models/HumeurUser');
const moment = require('moment');

// Route pour enregistrer l'humeur (sans authMiddleware)
router.post('/humeurs_utilisateurs', async (req, res) => {
    console.log('Payload reçu :', req.body); // Log pour debug
    try {
        const { date, timeOfDay, humeurId, description, userId } = req.body; // Ajout de userId

        if (!userId) {
            return res.status(400).json({ message: 'L\'ID utilisateur est requis.' });
        }

        // Validation de la date avec moment.js
        const parsedDate = moment(date, moment.ISO_8601, true);
        if (!parsedDate.isValid()) {
            return res.status(400).json({ message: 'La date est invalide.' });
        }

        const newHumeurUser = new HumeurUser({
            userId,
            date: parsedDate.toDate(), // Convertir la date en objet Date
            timeOfDay,
            humeurId,
            description: description || 'Aucune description fournie'
        });

        const savedHumeurUser = await newHumeurUser.save();
        res.status(201).json(savedHumeurUser);
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'humeur :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

// Route pour récupérer les humeurs de l'utilisateur (sans authMiddleware)
router.get('/humeurs_utilisateurs/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'L\'ID utilisateur est requis.' });
    }

    try {
        const humeurs = await HumeurUser.find({ userId }).sort({ date: 1 });

        if (!humeurs.length) {
            return res.status(404).json({ message: 'Aucune humeur trouvée pour cet utilisateur.' });
        }

        res.json(humeurs);
    } catch (error) {
        console.error('Erreur lors de la récupération des humeurs :', error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

module.exports = router;
