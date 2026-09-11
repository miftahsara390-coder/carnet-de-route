import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Image
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

// Grouper les voyages par catégorie
const groupByCategory = (trips: any[]) => {
  const groups: Record<string, any[]> = {};
  trips.forEach(t => {
    const cat = t.category || 'Non classé';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(t);
  });
  return groups;
};

export default function CarteScreen() {
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setLoading(true);
        const data = await getTrips();
        setTrips(data);
        setLoading(false);
      })();
    }, [])
  );

  const categories = [...new Set(trips.map(t => t.category || 'Non classé'))];
  const filtered = activeFilter ? trips.filter(t => (t.category || 'Non classé') === activeFilter) : trips;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Mes Destinations</Text>
            <Text style={styles.headerSubtitle}>Partout où tu es allé(e) 🌍</Text>
          </View>
        </View>

        {/* Map placeholder stylisé */}
        <View style={styles.mapBox}>
          <View style={styles.mapBg}>
            {/* Decorative map elements */}
            <View style={styles.mapGrid}>
              {[...Array(6)].map((_, i) => (
                <View key={i} style={styles.mapGridLine} />
              ))}
            </View>
            {/* Destinations markers */}
            {trips.slice(0, 5).map((t, i) => {
              const angles = [
                { top: '25%', left: '20%' },
                { top: '55%', left: '55%' },
                { top: '30%', left: '70%' },
                { top: '65%', left: '25%' },
                { top: '45%', left: '40%' },
              ];
              const pos = angles[i % angles.length];
              const cat = getCatColor(t.category);
              return (
                <TouchableOpacity
                  key={t._id || t.id}
                  style={[styles.mapMarker, { top: pos.top as any, left: pos.left as any, backgroundColor: cat.text }]}
                  onPress={() => router.push(`/trip/${t._id || t.id}`)}
                >
                  <Ionicons name="location-sharp" size={14} color="#FFF" />
                  <View style={styles.mapTooltip}>
                    <Text style={styles.mapTooltipText} numberOfLines={1}>{t.destination}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            <View style={styles.mapOverlay}>
              <Feather name="map" size={20} color="rgba(255,255,255,0.4)" />
              <Text style={styles.mapLabel}>{trips.length} {trips.length <= 1 ? 'destination' : 'destinations'}</Text>
            </View>
          </View>
        </View>

        {/* Filtres catégories */}
        {categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersScroll}
            contentContainerStyle={styles.filtersContent}
          >
            <TouchableOpacity
              style={[styles.filterChip, !activeFilter && styles.filterChipActive]}
              onPress={() => setActiveFilter(null)}
            >
              <Text style={[styles.filterText, !activeFilter && styles.filterTextActive]}>Tous</Text>
            </TouchableOpacity>
            {categories.map(cat => {
              const c = getCatColor(cat);
              const isActive = activeFilter === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.filterChip,
                    { backgroundColor: c.bg },
                    isActive && { borderWidth: 2, borderColor: c.text },
                  ]}
                  onPress={() => setActiveFilter(isActive ? null : cat)}
                >
                  <Text style={{ fontSize: 12 }}>{c.icon}</Text>
                  <Text style={[styles.filterText, { color: c.text }]}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Titre liste */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeFilter ? `Voyages — ${activeFilter}` : 'Tous les voyages'}
          </Text>
          <Text style={styles.sectionCount}>{filtered.length}</Text>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#F05A45" size="large" />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🗺️</Text>
            <Text style={styles.emptyText}>Aucun voyage pour cette catégorie</Text>
          </View>
        ) : (
          <View style={styles.destGrid}>
            {filtered.map(trip => {
              const cat = getCatColor(trip.category);
              return (
                <TouchableOpacity
                  key={trip._id || trip.id}
                  style={styles.destCard}
                  onPress={() => router.push(`/trip/${trip._id || trip.id}`)}
                  activeOpacity={0.85}
                >
                  {trip.image ? (
                    <Image source={{ uri: trip.image }} style={styles.destImage} />
                  ) : (
                    <View style={[styles.destImagePlaceholder, { backgroundColor: cat.bg }]}>
                      <Text style={{ fontSize: 30 }}>{cat.icon}</Text>
                    </View>
                  )}
                  <View style={styles.destOverlay} />
                  <View style={styles.destBadge}>
                    <Text style={[styles.destBadgeText, { color: cat.text }]}>{cat.icon} {trip.category}</Text>
                  </View>
                  <View style={styles.destInfo}>
                    <Text style={styles.destTitle} numberOfLines={1}>{trip.title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="location-sharp" size={10} color="#FFF" />
                      <Text style={styles.destLocation} numberOfLines={1}>{trip.destination}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {trips.length === 0 && !loading && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>✈️</Text>
            <Text style={styles.emptyTitle}>Aucun voyage encore</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/add-trip')}>
              <Text style={styles.addBtnText}>+ Ajouter un voyage</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
  header: { marginTop: 15, marginBottom: 20 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#1A237E' },
  headerSubtitle: { fontSize: 13, color: '#A0A0A0', marginTop: 2 },
  mapBox: { borderRadius: 20, overflow: 'hidden', marginBottom: 20, height: 200 },
  mapBg: {
    flex: 1, backgroundColor: '#1A237E',
    position: 'relative', overflow: 'hidden',
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row', justifyContent: 'space-around', opacity: 0.2,
  },
  mapGridLine: { width: 1, backgroundColor: '#FFF', flex: 1 },
  mapMarker: {
    position: 'absolute', width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, elevation: 4,
  },
  mapTooltip: {
    position: 'absolute', bottom: 32, left: -20,
    backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2, minWidth: 60,
  },
  mapTooltipText: { color: '#FFF', fontSize: 9, textAlign: 'center' },
  mapOverlay: {
    position: 'absolute', bottom: 15, right: 15,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  mapLabel: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  filtersScroll: { marginBottom: 20 },
  filtersContent: { gap: 8, paddingRight: 10 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: '#F0F0F0', borderRadius: 20,
  },
  filterChipActive: { backgroundColor: '#F05A45' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#666' },
  filterTextActive: { color: '#FFF' },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 15,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  sectionCount: {
    fontSize: 13, color: '#FFF', fontWeight: 'bold',
    backgroundColor: '#F05A45', paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 12,
  },
  loadingBox: { alignItems: 'center', marginTop: 30 },
  emptyBox: { alignItems: 'center', gap: 10, marginTop: 30 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  emptyText: { fontSize: 13, color: '#A0A0A0' },
  addBtn: {
    backgroundColor: '#F05A45', paddingHorizontal: 20,
    paddingVertical: 12, borderRadius: 12,
  },
  addBtnText: { color: '#FFF', fontWeight: 'bold' },
  destGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  destCard: {
    width: '47%', height: 150, borderRadius: 16, overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
  },
  destImage: { width: '100%', height: '100%' },
  destImagePlaceholder: {
    width: '100%', height: '100%',
    justifyContent: 'center', alignItems: 'center',
  },
  destOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  destBadge: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
  },
  destBadgeText: { fontSize: 9, fontWeight: 'bold' },
  destInfo: {
    position: 'absolute', bottom: 10, left: 10, right: 10,
  },
  destTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 13, marginBottom: 2 },
  destLocation: { color: 'rgba(255,255,255,0.85)', fontSize: 10, marginLeft: 2 },
});
