const Trip = require('../models/Trip');

// Fonction pour récupérer la liste des voyages
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fonction pour récupérer un seul voyage
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Voyage introuvable' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fonction pour créer un nouveau voyage
exports.createTrip = async (req, res) => {
  try {
    const newTrip = new Trip(req.body);
    // Assigner une image aléatoire par défaut si non fournie (pour le prototype)
    if (!newTrip.image) {
      newTrip.image = "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
    }
    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Fonction pour modifier un voyage existant
exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!trip) return res.status(404).json({ message: 'Voyage introuvable' });
    res.json(trip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Fonction pour supprimer un voyage
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Voyage introuvable' });
    res.json({ message: 'Voyage supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
