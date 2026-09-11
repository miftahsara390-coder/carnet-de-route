import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, ActivityIndicator, RefreshControl
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { getTrips } from '../../src/services/api';

const getCatColor = (cat: string) => {
  switch ((cat || '').toLowerCase()) {
    case 'culture':     return { bg: '#FDEAE6', text: '#F05A45', icon: '🏛️' };
    case 'plage':       return { bg: '#E3F2FD', text: '#1976D2', icon: '🏖️' };
    case 'aventure':    return { bg: '#FFF3E0', text: '#E65100', icon: '🏕️' };
    case 'nature':      return { bg: '#E8F5E9', text: '#388E3C', icon: '🌿' };
    case 'gastronomie': return { bg: '#FFFDE7', text: '#FBC02D', icon: '🍽️' };
    case 'ville':       return { bg: '#FCE4EC', text: '#C2185B', icon: '🌆' };
    default:            return { bg: '#F5F5F5', text: '#757575', icon: '✈️' };
  }
};

const formatDate = (d: string) => {
  if (!d) return '—';
  if (d.includes('/')) return d;
  try {
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return d; }
};

export default function CarnetScreen() {
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTrips = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    const data = await getTrips();
    setTrips(data);
    setLoading(false);
    setRefreshing(false);
  };

  // Recharger à chaque fois qu'on revient sur cet écran
  useFocusEffect(
    useCallback(() => { loadTrips(); }, [])
  );

  const totalDays = trips.reduce((acc, t) => {
    if (t.startDate && t.endDate) {
      try {
        const s = new Date(t.startDate.split('/').reverse().join('-'));
        const e = new Date(t.endDate.split('/').reverse().join('-'));
        const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
        return acc + (diff > 0 ? diff : 0);
      } catch { return acc; }
    }
    return acc;
  }, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadTrips(true)} colors={['#F05A45']} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Mon Carnet</Text>
            <Text style={styles.headerSubtitle}>Tous tes souvenirs ✨</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/add-trip')}>
            <Feather name="plus" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Stats Banner */}
        <View style={styles.statsBanner}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{trips.length}</Text>
            <Text style={styles.statLabel}>Voyages</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{new Set(trips.map(t => t.destination)).size}</Text>
            <Text style={styles.statLabel}>Destinations</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalDays > 0 ? totalDays : trips.length * 4}</Text>
            <Text style={styles.statLabel}>Jours</Text>
          </View>
        </View>

        {/* Liste titre */}
        <Text style={styles.listTitle}>
          <Feather name="book-open" size={16} color="#333" /> Journal de voyage
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F05A45" />
            <Text style={styles.loadingText}>Chargement de tes voyages...</Text>
          </View>
        ) : trips.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🗺️</Text>
            <Text style={styles.emptyTitle}>Ton carnet est vide</Text>
            <Text style={styles.emptyText}>Commence par ajouter ton premier voyage !</Text>
            <TouchableOpacity style={styles.addFirstBtn} onPress={() => router.push('/add-trip')}>
              <Feather name="plus" size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.addFirstText}>Ajouter un voyage</Text>
            </TouchableOpacity>
          </View>
        ) : (
          trips.map((trip, index) => {
            const catStyle = getCatColor(trip.category);
            const isLast = index === trips.length - 1;
            return (
              <View key={trip._id || trip.id} style={styles.timelineItem}>
                {/* Ligne de timeline */}
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, { backgroundColor: catStyle.text }]}>
                    <Text style={styles.timelineDotIcon}>{catStyle.icon}</Text>
                  </View>
                  {!isLast && <View style={styles.timelineLine} />}
                </View>

                {/* Carte du voyage */}
                <TouchableOpacity
                  style={styles.tripCard}
                  onPress={() => router.push(`/trip/${trip._id || trip.id}`)}
                  activeOpacity={0.85}
                >
                  <View style={styles.cardTop}>
                    {trip.image ? (
                      <Image source={{ uri: trip.image }} style={styles.tripImage} />
                    ) : (
                      <View style={[styles.tripImagePlaceholder, { backgroundColor: catStyle.bg }]}>
                        <Text style={styles.tripImageEmoji}>{catStyle.icon}</Text>
                      </View>
                    )}
                    <View style={styles.cardInfo}>
                      <Text style={styles.tripTitle} numberOfLines={1}>{trip.title}</Text>
                      <View style={styles.destRow}>
                        <Ionicons name="location-sharp" size={12} color="#F05A45" />
                        <Text style={styles.destText} numberOfLines={1}>{trip.destination}</Text>
                      </View>
                      <View style={styles.dateRow}>
                        <Feather name="calendar" size={11} color="#A0A0A0" />
                        <Text style={styles.dateText}>
                          {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
                        </Text>
                      </View>
                    </View>
                    <Feather name="chevron-right" size={18} color="#F05A45" />
                  </View>

                  {trip.description ? (
                    <Text style={styles.cardDesc} numberOfLines={2}>
                      "{trip.description}"
                    </Text>
                  ) : null}

                  <View style={[styles.catBadge, { backgroundColor: catStyle.bg }]}>
                    <Text style={[styles.catText, { color: catStyle.text }]}>{trip.category || 'Non classé'}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        )}
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
  headerSubtitle: { fontSize: 13, color: '#A0A0A0', marginTop: 2 },
  addBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#F05A45', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#F05A45', shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  statsBanner: {
    flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20,
    padding: 20, marginBottom: 25,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#F05A45' },
  statLabel: { fontSize: 11, color: '#A0A0A0', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#F0F0F0', marginVertical: 5 },
  listTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  loadingContainer: { alignItems: 'center', marginTop: 40, gap: 12 },
  loadingText: { color: '#A0A0A0', fontSize: 14 },
  emptyContainer: { alignItems: 'center', marginTop: 50, gap: 10 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  emptyText: { fontSize: 13, color: '#A0A0A0', textAlign: 'center' },
  addFirstBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F05A45', paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 12, marginTop: 10,
  },
  addFirstText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  timelineItem: { flexDirection: 'row', marginBottom: 20 },
  timelineLeft: { alignItems: 'center', marginRight: 15, paddingTop: 5 },
  timelineDot: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  timelineDotIcon: { fontSize: 16 },
  timelineLine: {
    width: 2, flex: 1, backgroundColor: '#F0F0F0',
    marginTop: 4, marginBottom: -15,
  },
  tripCard: {
    flex: 1, backgroundColor: '#FFF', borderRadius: 18, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  tripImage: { width: 55, height: 55, borderRadius: 12 },
  tripImagePlaceholder: {
    width: 55, height: 55, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  tripImageEmoji: { fontSize: 24 },
  cardInfo: { flex: 1, marginHorizontal: 12 },
  tripTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 3 },
  destRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  destText: { fontSize: 11, color: '#888', marginLeft: 3 },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  dateText: { fontSize: 10, color: '#A0A0A0', marginLeft: 4 },
  cardDesc: {
    fontSize: 12, color: '#888', fontStyle: 'italic',
    lineHeight: 18, marginBottom: 10,
  },
  catBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start' },
  catText: { fontSize: 10, fontWeight: 'bold' },
});
