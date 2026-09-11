const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

// Récupérer tous les voyages
router.get('/', tripController.getAllTrips);

// Récupérer un voyage
router.get('/:id', tripController.getTripById);

// Ajouter un voyage
router.post('/', tripController.createTrip);

// Modifier un voyage
router.put('/:id', tripController.updateTrip);

// Supprimer un voyage
router.delete('/:id', tripController.deleteTrip);

module.exports = router;
