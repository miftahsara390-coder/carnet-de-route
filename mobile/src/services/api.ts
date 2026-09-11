import { Platform } from 'react-native';

// L'URL de base dépend de l'endroit où tu lances l'application :
// - Sur le navigateur web ou un émulateur iOS : localhost
// - Sur un émulateur Android : 10.0.2.2
// - Sur ton VRAI téléphone : il faut mettre l'adresse IP de ton ordinateur sur le wifi (ex: 192.168.1.XX)

const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000/api'
  : 'http://localhost:3000/api';

// Récupérer tous les voyages
export const getTrips = async () => {
  try {
    const response = await fetch(`${BASE_URL}/trips`);
    if (!response.ok) throw new Error('Erreur réseau');
    return await response.json();
  } catch (error) {
    console.error("Erreur getTrips:", error);
    return [];
  }
};

// Récupérer un seul voyage par ID
export const getTripById = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/trips/${id}`);
    if (!response.ok) throw new Error('Voyage introuvable');
    return await response.json();
  } catch (error) {
    console.error("Erreur getTripById:", error);
    throw error;
  }
};

// Créer un nouveau voyage
export const createTrip = async (tripData: any) => {
  try {
    const response = await fetch(`${BASE_URL}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripData)
    });
    if (!response.ok) throw new Error('Erreur lors de la création');
    return await response.json();
  } catch (error) {
    console.error("Erreur createTrip:", error);
    throw error;
  }
};

// Modifier un voyage existant
export const updateTrip = async (id: string, tripData: any) => {
  try {
    const response = await fetch(`${BASE_URL}/trips/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripData)
    });
    if (!response.ok) throw new Error('Erreur lors de la modification');
    return await response.json();
  } catch (error) {
    console.error("Erreur updateTrip:", error);
    throw error;
  }
};

// Supprimer un voyage
export const deleteTrip = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/trips/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression');
    return await response.json();
  } catch (error) {
    console.error("Erreur deleteTrip:", error);
    throw error;
  }
};
