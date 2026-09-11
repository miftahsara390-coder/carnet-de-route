import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, ActivityIndicator, Alert
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTripById, deleteTrip } from '../../src/services/api';

const getCatColor = (cat: string) => {
  switch ((cat || '').toLowerCase()) {
    case 'culture':     return { bg: '#FDEAE6', text: '#F05A45' };
    case 'plage':       return { bg: '#E3F2FD', text: '#1976D2' };
    case 'aventure':    return { bg: '#FFF3E0', text: '#E65100' };
    case 'nature':      return { bg: '#E8F5E9', text: '#388E3C' };
    case 'gastronomie': return { bg: '#FFFDE7', text: '#FBC02D' };
    case 'ville':       return { bg: '#FCE4EC', text: '#C2185B' };
    default:            return { bg: '#F5F5F5', text: '#757575' };
  }
};

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) loadTrip();
  }, [id]);

  const loadTrip = async () => {
    setLoading(true);
    try {
      const data = await getTripById(id as string);
      setTrip(data);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger ce voyage.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le voyage',
      `Es-tu sûr(e) de vouloir supprimer "${trip?.title}" ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteTrip(id as string);
              router.back();
            } catch {
              Alert.alert('Erreur', 'Impossible de supprimer ce voyage.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détail du voyage</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F05A45" />
          <Text style={styles.loadingText}>Chargement du voyage...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!trip) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détail du voyage</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Feather name="frown" size={48} color="#CCC" />
          <Text style={styles.errorText}>Voyage introuvable</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.goBackBtn}>
            <Text style={styles.goBackText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const catColors = getCatColor(trip.category);
  const mainImage = trip.image
    || 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  const formatDate = (d: string) => {
    if (!d) return '';
    // If already formatted as dd/mm/yyyy, return as is
    if (d.includes('/')) return d;
    // If ISO date, format nicely
    try {
      return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return d; }
  };

  const dates = trip.startDate || trip.endDate
    ? `${formatDate(trip.startDate)} — ${formatDate(trip.endDate)}`
    : 'Dates non définies';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détail du voyage</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Feather name="more-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: mainImage }} style={styles.coverImage} resizeMode="cover" />
          <View style={styles.imageOverlay} />

          <View style={styles.locationBadge}>
            <Ionicons name="location-sharp" size={14} color="#F05A45" />
            <Text style={styles.locationText}>{trip.destination || trip.title}</Text>
          </View>

          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>📸 1/1</Text>
          </View>
        </View>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={[styles.categoryBadge, { backgroundColor: catColors.bg }]}>
            <Feather name="tag" size={12} color={catColors.text} style={{ marginRight: 4 }} />
            <Text style={[styles.categoryText, { color: catColors.text }]}>{trip.category || 'Non classé'}</Text>
          </View>
          <View style={styles.dateBadge}>
            <Feather name="calendar" size={14} color="#A0A0A0" />
            <Text style={styles.dateText}>{dates}</Text>
          </View>
        </View>

        {/* Section Impressions */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="sun" size={16} color="#F05A45" style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>Mes impressions</Text>
          </View>
          <TouchableOpacity onPress={() => router.push(`/trip/edit-${id}`)}>
            <Text style={styles.editText}>Éditer</Text>
          </TouchableOpacity>
        </View>

        {trip.description ? (
          <Text style={styles.paragraph}>{trip.description}</Text>
        ) : (
          <Text style={styles.emptyText}>Aucune description pour ce voyage. Appuie sur "Éditer" pour ajouter tes impressions !</Text>
        )}

        {trip.description && trip.description.length > 80 && (
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>
              « {trip.description.substring(0, 100)}... »
            </Text>
          </View>
        )}

        {/* Section Photos */}
        <View style={[styles.sectionHeader, { marginTop: 25 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="camera" size={16} color="#388E3C" style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>Photos du voyage</Text>
          </View>
        </View>

        <View style={styles.photosGrid}>
          <Image
            source={{ uri: mainImage }}
            style={styles.thumbImage}
          />
          <View style={styles.noPhotoBox}>
            <Feather name="image" size={24} color="#CCC" />
            <Text style={styles.noPhotoText}>Ajouter des photos</Text>
          </View>
        </View>

      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push(`/trip/edit-${id}`)}
        >
          <Feather name="edit-2" size={16} color="#333" style={{ marginRight: 8 }} />
          <Text style={styles.secondaryBtnText}>Modifier le voyage</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDelete}
          disabled={deleting}
        >
          {deleting
            ? <ActivityIndicator size="small" color="#F05A45" />
            : <Feather name="trash-2" size={18} color="#F05A45" />
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 15,
  },
  backBtn: { padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A237E' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15 },
  loadingText: { color: '#A0A0A0', fontSize: 14 },
  errorText: { color: '#CCC', fontSize: 16, marginTop: 10 },
  goBackBtn: { marginTop: 15, paddingHorizontal: 25, paddingVertical: 10, backgroundColor: '#F05A45', borderRadius: 10 },
  goBackText: { color: '#FFF', fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  coverContainer: {
    width: '100%', height: 220, borderRadius: 20,
    overflow: 'hidden', position: 'relative', marginBottom: 20,
  },
  coverImage: { width: '100%', height: '100%' },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  locationBadge: {
    position: 'absolute', bottom: 15, left: 15,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15,
  },
  locationText: { color: '#333', fontSize: 13, fontWeight: 'bold', marginLeft: 5 },
  counterBadge: {
    position: 'absolute', bottom: 15, right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15,
  },
  counterText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  categoryBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 15, marginRight: 15,
  },
  categoryText: { fontWeight: 'bold', fontSize: 12 },
  dateBadge: { flexDirection: 'row', alignItems: 'center' },
  dateText: { color: '#A0A0A0', fontSize: 12, marginLeft: 6 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  editText: { fontSize: 14, color: '#F05A45', fontWeight: '600' },
  paragraph: {
    fontSize: 13, color: '#666', lineHeight: 22,
    marginBottom: 15, textAlign: 'justify',
  },
  emptyText: {
    fontSize: 13, color: '#BDBDBD', fontStyle: 'italic',
    lineHeight: 20, marginBottom: 15,
  },
  quoteBox: {
    backgroundColor: '#FFF3E0', padding: 15,
    borderRadius: 12, borderLeftWidth: 3, borderLeftColor: '#F05A45',
    marginBottom: 10,
  },
  quoteText: { fontStyle: 'italic', color: '#888', fontSize: 12, textAlign: 'center' },
  photosGrid: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  thumbImage: { width: 90, height: 90, borderRadius: 14 },
  noPhotoBox: {
    flex: 1, height: 90, borderRadius: 14,
    backgroundColor: '#F5F5F5', borderWidth: 1.5,
    borderColor: '#E0E0E0', borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center', gap: 4,
  },
  noPhotoText: { color: '#CCC', fontSize: 10 },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between',
    padding: 20, backgroundColor: '#FAFAFA',
    borderTopWidth: 1, borderColor: '#F0F0F0',
  },
  secondaryBtn: {
    flex: 1, flexDirection: 'row',
    backgroundColor: '#E8F5E9', justifyContent: 'center',
    alignItems: 'center', paddingVertical: 14,
    borderRadius: 12, marginRight: 10,
  },
  secondaryBtnText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  deleteBtn: {
    width: 50, height: 50, backgroundColor: '#FDEAE6',
    justifyContent: 'center', alignItems: 'center', borderRadius: 12,
  },
});
