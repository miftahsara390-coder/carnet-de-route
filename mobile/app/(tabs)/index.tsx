import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import TripCard from '../../src/components/TripCard';
import { getTrips } from '../../src/services/api';

export default function HomeScreen() {
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les voyages au lancement
  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    const data = await getTrips();
    setTrips(data);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {/* Remplacement du logo montagne par des icônes pour la démo */}
            <View style={styles.mountainIcon}>
              <Feather name="map-pin" size={24} color="#F05A45" />
            </View>
            <View style={styles.headerTexts}>
              <Text style={styles.headerTitle}>Carnet de Route</Text>
              <Text style={styles.headerSubtitle}>Tes voyages, ton histoire</Text>
            </View>
          </View>
          <View style={styles.avatarContainer}>
            <Feather name="user" size={20} color="#F05A45" />
          </View>
        </View>

        {/* Banner Bienvenue */}
        <View style={styles.banner}>
          <View style={styles.bannerTop}>
            <View>
              <Text style={styles.bannerGreeting}>Bonjour Sara !</Text>
              <Text style={styles.bannerQuestion}>Où veux-tu voyager aujourd'hui ?</Text>
            </View>
            <Feather name="send" size={20} color="#388E3C" style={{ transform: [{ rotate: '45deg' }], marginTop: 5 }} />
          </View>
          
          <View style={styles.searchContainer}>
            <Feather name="search" size={18} color="#A0A0A0" />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Rechercher un voyage..." 
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        {/* Section Mes Voyages */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mes voyages</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Voir tout <Feather name="arrow-right" size={14} /></Text>
          </TouchableOpacity>
        </View>

        {/* Liste des voyages */}
        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#F05A45" style={{ marginTop: 20 }} />
          ) : trips.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>Aucun voyage pour le moment.</Text>
          ) : (
            trips.map((trip) => (
              <TripCard 
                key={trip._id || trip.id}
                title={trip.title || trip.destination}
                dates={`${trip.startDate || ''} — ${trip.endDate || ''}`}
                category={trip.category || 'Non classé'}
                imageSource={trip.image}
                onPress={() => router.push(`/trip/${trip._id || trip.id}`)}
              />
            ))
          )}
        </View>

      </ScrollView>

      {/* Floating Action Button (FAB) pour ajouter un voyage */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/add-trip')}
        activeOpacity={0.8}
      >
        <Feather name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mountainIcon: {
    marginRight: 10,
  },
  headerTexts: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#888',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDEAE6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
  },
  bannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  bannerGreeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bannerQuestion: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 45,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#F05A45',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F05A45',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F05A45',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8,
  }
});
