import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import TripCard from '../../src/components/TripCard';

// Données fictives pour l'UI
const trips = [
  { id: '1', title: 'Marrakech', dates: '12 juin 2026 — 16 juin 2026', category: 'Culture', image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: '2', title: 'Essaouira', dates: '5 avr. 2026 — 12 avr. 2026', category: 'Plage', image: 'https://images.unsplash.com/photo-1570535352843-f72f0f4a7c06?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: '3', title: 'Ouarzazate', dates: '18 févr. 2026 — 25 févr. 2026', category: 'Aventure', image: 'https://images.unsplash.com/photo-1620600171058-f9b177d8a6fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: '4', title: 'Chefchaouen', dates: '10 sept. 2025 — 17 sept. 2025', category: 'Nature', image: 'https://images.unsplash.com/photo-1554902157-1ee6ba6b36a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
];

export default function HomeScreen() {
  const router = useRouter();

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
          {trips.map((trip) => (
            <TripCard 
              key={trip.id}
              title={trip.title}
              dates={trip.dates}
              category={trip.category}
              imageSource={trip.image}
              onPress={() => router.push(`/trip/${trip.id}`)}
            />
          ))}
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
