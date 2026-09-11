import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { getTrips } from '../../src/services/api';

const CATEGORIES_ICONS: Record<string, string> = {
  Culture: '🏛️', Nature: '🌿', Plage: '🏖️',
  Aventure: '🏕️', Gastronomie: '🍽️', Ville: '🌆',
};

export default function ProfilScreen() {
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await getTrips();
        setTrips(data);
      })();
    }, [])
  );

  // Statistiques calculées
  const totalTrips = trips.length;
  const totalDests = new Set(trips.map(t => t.destination)).size;
  const totalCats = new Set(trips.map(t => t.category).filter(Boolean)).size;

  // Catégorie préférée
  const catCount: Record<string, number> = {};
  trips.forEach(t => { if (t.category) catCount[t.category] = (catCount[t.category] || 0) + 1; });
  const favCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  // Voyages récents (3 derniers)
  const recentTrips = trips.slice(0, 3);

  const getCatColor = (cat: string) => {
    switch ((cat || '').toLowerCase()) {
      case 'culture':     return '#F05A45';
      case 'plage':       return '#1976D2';
      case 'aventure':    return '#E65100';
      case 'nature':      return '#388E3C';
      case 'gastronomie': return '#FBC02D';
      case 'ville':       return '#C2185B';
      default:            return '#757575';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <TouchableOpacity>
            <Feather name="settings" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Carte profil */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>👩‍🌍</Text>
            </View>
            <View style={styles.editAvatarBtn}>
              <Feather name="edit-2" size={12} color="#FFF" />
            </View>
          </View>
          <Text style={styles.userName}>Sara El Amrani</Text>
          <Text style={styles.userTitle}>🌍 Grande Voyageuse</Text>
          <View style={styles.profileTagsRow}>
            <View style={styles.profileTag}>
              <Text style={styles.profileTagText}>✈️ Exploratrice</Text>
            </View>
            <View style={styles.profileTag}>
              <Text style={styles.profileTagText}>📸 Photographe</Text>
            </View>
            <View style={styles.profileTag}>
              <Text style={styles.profileTagText}>🍵 Foodie</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>✈️</Text>
            <Text style={styles.statNumber}>{totalTrips}</Text>
            <Text style={styles.statLabel}>Voyages</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📍</Text>
            <Text style={styles.statNumber}>{totalDests}</Text>
            <Text style={styles.statLabel}>Destinations</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🗂️</Text>
            <Text style={styles.statNumber}>{totalCats}</Text>
            <Text style={styles.statLabel}>Catégories</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>{CATEGORIES_ICONS[favCat] || '⭐'}</Text>
            <Text style={[styles.statNumber, { fontSize: 13 }]}>{favCat}</Text>
            <Text style={styles.statLabel}>Préférée</Text>
          </View>
        </View>

        {/* Voyages récents */}
        {recentTrips.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Voyages récents</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/carnet')}>
                <Text style={styles.seeAll}>Voir tout →</Text>
              </TouchableOpacity>
            </View>

            {recentTrips.map(trip => (
              <TouchableOpacity
                key={trip._id || trip.id}
                style={styles.recentCard}
                onPress={() => router.push(`/trip/${trip._id || trip.id}`)}
                activeOpacity={0.8}
              >
                <View style={[styles.recentDot, { backgroundColor: getCatColor(trip.category) }]}>
                  <Text style={{ fontSize: 14 }}>{CATEGORIES_ICONS[trip.category] || '✈️'}</Text>
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentTitle}>{trip.title}</Text>
                  <Text style={styles.recentDest}>{trip.destination}</Text>
                </View>
                <Feather name="chevron-right" size={16} color="#F05A45" />
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Actions</Text>
        </View>

        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/add-trip')}>
            <View style={[styles.actionIcon, { backgroundColor: '#FDEAE6' }]}>
              <Feather name="plus-circle" size={20} color="#F05A45" />
            </View>
            <Text style={styles.actionText}>Ajouter un voyage</Text>
            <Feather name="chevron-right" size={16} color="#CCC" />
          </TouchableOpacity>

          <View style={styles.actionDivider} />

          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Feather name="download" size={20} color="#388E3C" />
            </View>
            <Text style={styles.actionText}>Exporter mon carnet</Text>
            <Feather name="chevron-right" size={16} color="#CCC" />
          </TouchableOpacity>

          <View style={styles.actionDivider} />

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => Alert.alert('Partage', 'Fonctionnalité bientôt disponible !')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
              <Feather name="share-2" size={20} color="#1976D2" />
            </View>
            <Text style={styles.actionText}>Partager mon profil</Text>
            <Feather name="chevron-right" size={16} color="#CCC" />
          </TouchableOpacity>

          <View style={styles.actionDivider} />

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => Alert.alert('Paramètres', 'Fonctionnalité bientôt disponible !')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F5F5F5' }]}>
              <Feather name="settings" size={20} color="#757575" />
            </View>
            <Text style={styles.actionText}>Paramètres</Text>
            <Feather name="chevron-right" size={16} color="#CCC" />
          </TouchableOpacity>
        </View>

        {/* Citation du bas */}
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>
            « Le voyage est la seule chose qu'on achète qui nous rend plus riche. »
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 15, marginBottom: 20,
  },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#1A237E' },
  profileCard: {
    backgroundColor: '#FFF', borderRadius: 24, padding: 24,
    alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 12, elevation: 3,
  },
  avatarWrapper: { position: 'relative', marginBottom: 15 },
  avatarCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#FDEAE6', justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#F05A45',
  },
  avatarEmoji: { fontSize: 44 },
  editAvatarBtn: {
    position: 'absolute', bottom: 2, right: 2,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#F05A45', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFF',
  },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#1A237E', marginBottom: 4 },
  userTitle: { fontSize: 14, color: '#888', marginBottom: 15 },
  profileTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  profileTag: {
    backgroundColor: '#F5F5F5', paddingHorizontal: 12,
    paddingVertical: 5, borderRadius: 12,
  },
  profileTagText: { fontSize: 11, color: '#555', fontWeight: '600' },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 25,
  },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: '#FFF', borderRadius: 18,
    padding: 16, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  statEmoji: { fontSize: 22, marginBottom: 6 },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#F05A45' },
  statLabel: { fontSize: 11, color: '#A0A0A0', marginTop: 2 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  seeAll: { fontSize: 13, color: '#F05A45', fontWeight: '600' },
  recentCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: 16, padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  recentDot: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  recentInfo: { flex: 1 },
  recentTitle: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  recentDest: { fontSize: 11, color: '#A0A0A0', marginTop: 2 },
  actionsCard: {
    backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  actionItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 15,
  },
  actionIcon: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  actionText: { flex: 1, fontSize: 14, color: '#333', fontWeight: '500' },
  actionDivider: { height: 1, backgroundColor: '#F5F5F5', marginLeft: 72 },
  quoteBox: {
    backgroundColor: '#E8F5E9', borderRadius: 16, padding: 20,
    borderLeftWidth: 4, borderLeftColor: '#388E3C',
  },
  quoteText: {
    fontStyle: 'italic', color: '#388E3C',
    fontSize: 13, lineHeight: 20, textAlign: 'center',
  },
});
