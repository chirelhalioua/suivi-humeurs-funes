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

        const startOfDay = parsedDate.clone().startOf('day').toDate();
        const endOfDay = parsedDate.clone().endOf('day').toDate();

        // Une seule humeur par période (matin/soir) et par jour.
        // Si l'utilisateur change d'humeur, on remplace l'ancienne au lieu d'en créer une nouvelle.
        const existingMood = await HumeurUser.findOne({
            userId,
            timeOfDay,
            date: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ _id: -1 });

        if (existingMood) {
            existingMood.humeurId = humeurId;
            existingMood.description = description || 'Aucune description fournie';
            existingMood.date = parsedDate.toDate();

            const updatedMood = await existingMood.save();

            // Nettoie d'éventuels doublons déjà créés auparavant pour ce même créneau.
            await HumeurUser.deleteMany({
                _id: { $ne: existingMood._id },
                userId,
                timeOfDay,
                date: { $gte: startOfDay, $lte: endOfDay }
            });

            return res.status(200).json(updatedMood);
        }

        const newHumeurUser = new HumeurUser({
            userId,
            date: parsedDate.toDate(),
            timeOfDay,
            humeurId,
            description: description || 'Aucune description fournie'
        });

        const savedHumeurUser = await newHumeurUser.save();
        return res.status(201).json(savedHumeurUser);
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
        const humeurs = await HumeurUser.find({ userId }).sort({ date: 1, _id: 1 });

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
