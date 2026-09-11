import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import { getTripById, updateTrip } from '../../src/services/api';

const CATEGORIES = ['Culture', 'Nature', 'Plage', 'Aventure', 'Gastronomie', 'Ville'];

const getCatColor = (cat: string) => {
  switch (cat.toLowerCase()) {
    case 'culture':     return { bg: '#FDEAE6', text: '#F05A45' };
    case 'plage':       return { bg: '#E3F2FD', text: '#1976D2' };
    case 'aventure':    return { bg: '#FFF3E0', text: '#E65100' };
    case 'nature':      return { bg: '#E8F5E9', text: '#388E3C' };
    case 'gastronomie': return { bg: '#FFFDE7', text: '#FBC02D' };
    case 'ville':       return { bg: '#FCE4EC', text: '#C2185B' };
    default:            return { bg: '#F5F5F5', text: '#757575' };
  }
};

export default function EditTripScreen() {
  const params = useLocalSearchParams();
  // L'id peut arriver comme param direct ou extrait du nom du fichier (edit-[id])
  const rawId = params.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  useEffect(() => {
    if (rawId) loadTrip();
  }, [rawId]);

  const loadTrip = async () => {
    setLoading(true);
    try {
      const data = await getTripById(rawId);
      setTitle(data.title || '');
      setDestination(data.destination || '');
      setStartDate(data.startDate || '');
      setEndDate(data.endDate || '');
      setDesc(data.description || '');
      setSelectedCat(data.category || '');
    } catch {
      Alert.alert('Erreur', 'Impossible de charger ce voyage.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !destination) {
      Alert.alert('Champs obligatoires', 'Le titre et la destination sont obligatoires !');
      return;
    }
    setSaving(true);
    try {
      await updateTrip(rawId, {
        title,
        destination,
        startDate,
        endDate,
        description: desc,
        category: selectedCat || 'Culture',
      });
      Alert.alert('✅ Voyage modifié !', 'Les modifications ont été enregistrées.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Erreur', "Impossible de modifier ce voyage.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F05A45" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier le voyage</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Feather name="check" size={24} color="#F05A45" />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Mets à jour ton voyage ✈️</Text>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Input
          label="Titre du voyage *"
          placeholder="Exemple : Marrakech, Maroc"
          iconName="map"
          iconColor="#F05A45"
          value={title}
          onChangeText={setTitle}
        />

        <Input
          label="Destination *"
          placeholder="Exemple : Marrakech, Maroc"
          iconName="map-pin"
          iconColor="#F05A45"
          value={destination}
          onChangeText={setDestination}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Input
              label="Date de départ"
              placeholder="jj/mm/aaaa"
              iconName="calendar"
              value={startDate}
              onChangeText={setStartDate}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Input
              label="Date de retour"
              placeholder="jj/mm/aaaa"
              iconName="calendar"
              value={endDate}
              onChangeText={setEndDate}
            />
          </View>
        </View>

        <Input
          label="Mes impressions"
          placeholder="Raconte ton voyage, tes impressions, les endroits que tu as visités..."
          iconName="message-square"
          multiline={true}
          maxLength={500}
          value={desc}
          onChangeText={setDesc}
        />

        {/* Catégories */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Feather name="grid" size={16} color="#F05A45" style={{ marginRight: 6 }} />
            <Text style={styles.label}>Catégories</Text>
          </View>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(cat => {
              const colors = getCatColor(cat);
              const isSelected = selectedCat === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCat(cat)}
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: colors.bg },
                    isSelected && { borderWidth: 2, borderColor: colors.text },
                  ]}
                >
                  <Text style={[styles.categoryText, { color: colors.text }]}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Info box */}
        <View style={styles.infoBox}>
          <Feather name="info" size={16} color="#1976D2" style={{ marginRight: 8 }} />
          <Text style={styles.infoText}>
            Les modifications seront sauvegardées dans ton carnet de voyage.
          </Text>
        </View>

      </ScrollView>

      {/* Bouton fixe en bas */}
      <View style={styles.footer}>
        <Button
          title={saving ? "Enregistrement..." : "Enregistrer les modifications"}
          onPress={handleSave}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15 },
  loadingText: { color: '#A0A0A0', fontSize: 14 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 10,
  },
  backBtn: { padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A237E' },
  subtitle: {
    color: '#A0A0A0', fontSize: 14, paddingHorizontal: 20,
    marginTop: 5, marginBottom: 20, textAlign: 'center',
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  categorySection: { marginBottom: 20 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryBadge: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  categoryText: { fontSize: 12, fontWeight: 'bold' },
  infoBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E3F2FD', borderRadius: 12,
    padding: 15, marginTop: 10,
  },
  infoText: { flex: 1, color: '#1976D2', fontSize: 12, lineHeight: 18 },
  footer: {
    padding: 20, backgroundColor: '#FAFAFA',
    borderTopWidth: 1, borderColor: '#F0F0F0',
  },
});
