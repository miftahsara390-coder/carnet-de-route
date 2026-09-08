require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const tripRoutes = require('./routes/tripRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/carnet-de-route';
    await mongoose.connect(mongoURI);
    console.log('📦 Connecté à MongoDB avec succès !');
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error.message);
    console.warn('⚠️  Si tu n\\'as pas MongoDB installé, l\\'API risque de ne pas fonctionner.');
  }
};
connectDB();

// Routes
app.use('/api/trips', tripRoutes);

// Route de base pour vérifier que l'API tourne
app.get('/', (req, res) => {
  res.send('✅ API Carnet de Route en ligne !');
});

app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});
