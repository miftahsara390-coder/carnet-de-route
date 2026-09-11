import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import { createTrip } from '../src/services/api';

const CATEGORIES = [
  { name: 'Culture',     icon: '🏛️', bg: '#FDEAE6', text: '#F05A45' },
  { name: 'Nature',      icon: '🌿', bg: '#E8F5E9', text: '#388E3C' },
  { name: 'Plage',       icon: '🏖️', bg: '#E3F2FD', text: '#1976D2' },
  { name: 'Aventure',    icon: '🏕️', bg: '#FFF3E0', text: '#E65100' },
  { name: 'Gastronomie', icon: '🍽️', bg: '#FFFDE7', text: '#FBC02D' },
  { name: 'Ville',       icon: '🌆', bg: '#FCE4EC', text: '#C2185B' },
];

export default function AddTripScreen() {
  const router = useRouter();
  const [title, setTitle]         = useState('');
  const [destination, setDest]    = useState('');
  const [startDate, setStart]     = useState('');
  const [endDate, setEnd]         = useState('');
  const [desc, setDesc]           = useState('');
  const [selectedCat, setCat]     = useState('');
  const [loading, setLoading]     = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !destination.trim()) {
      Alert.alert('Champs requis', 'Le titre et la destination sont obligatoires !');
      return;
    }
    setLoading(true);
    try {
      await createTrip({
        title, destination, startDate, endDate,
        description: desc, category: selectedCat || 'Culture',
      });
      router.back();
    } catch {
      Alert.alert('Erreur', "L'enregistrement a échoué. Vérifie ta connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajouter un voyage</Text>
        <Feather name="send" size={20} color="#F05A45" style={{ transform: [{ rotate: '-45deg' }] }} />
      </View>
      <Text style={styles.subtitle}>Nouveau voyage, nouvelles aventures !</Text>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Input label="Titre du voyage *"    placeholder="Exemple : Marrakech, Maroc"
          iconName="map"       iconColor="#F05A45" value={title}     onChangeText={setTitle} />

        <Input label="Destination *"        placeholder="Exemple : Marrakech, Maroc"
          iconName="map-pin"   iconColor="#F05A45" value={destination} onChangeText={setDest} />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Input label="Date de départ" placeholder="jj/mm/aaaa"
              iconName="calendar" value={startDate} onChangeText={setStart} />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Input label="Date de retour" placeholder="jj/mm/aaaa"
              iconName="calendar" value={endDate} onChangeText={setEnd} />
          </View>
        </View>

        <Input label="Mots personnalisés"
          placeholder="Raconte ton voyage, tes impressions, les endroits que tu as visités..."
          iconName="message-square" multiline maxLength={100}
          value={desc} onChangeText={setDesc} />

        {/* Catégories */}
        <View style={styles.catSection}>
          <View style={styles.catHeader}>
            <Feather name="grid" size={15} color="#F05A45" />
            <Text style={styles.catLabel}>Catégories</Text>
          </View>
          <View style={styles.catGrid}>
            {CATEGORIES.map(cat => {
              const active = selectedCat === cat.name;
              return (
                <TouchableOpacity
                  key={cat.name}
                  onPress={() => setCat(active ? '' : cat.name)}
                  style={[
                    styles.catPill,
                    { backgroundColor: cat.bg },
                    active && { borderWidth: 2, borderColor: cat.text },
                  ]}
                  activeOpacity={0.75}
                >
                  <Text style={styles.catIcon}>{cat.icon}</Text>
                  <Text style={[styles.catName, { color: cat.text }]}>{cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Citation */}
        <View style={styles.quoteBox}>
          <Feather name="sun" size={22} color="#FBC02D" style={styles.quoteSun} />
          <Text style={styles.quoteText}>
            « Voyager, c'est donner un sens à sa vie, c'est donner de la couleur à ses souvenirs. »
          </Text>
          <Feather name="heart" size={14} color="#F05A45" style={styles.quoteHeart} />
        </View>

      </ScrollView>

      {/* Bouton fixe en bas */}
      <View style={styles.footer}>
        {loading
          ? <ActivityIndicator color="#F05A45" size="small" />
          : <Button title="Enregistrer le voyage" onPress={handleSave} />
        }
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#FAFAFA' },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  backBtn:      { padding: 5, marginLeft: -5 },
  headerTitle:  { fontSize: 18, fontWeight: 'bold', color: '#1A237E' },
  subtitle:     { color: '#A0A0A0', fontSize: 13, textAlign: 'center', marginTop: 4, marginBottom: 20 },
  scrollContent:{ paddingHorizontal: 20, paddingBottom: 20 },
  row:          { flexDirection: 'row' },
  catSection:   { marginBottom: 20 },
  catHeader:    { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12 },
  catLabel:     { fontSize: 14, fontWeight: 'bold', color: '#333' },
  catGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  catPill:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, paddingVertical: 8, borderRadius: 20 },
  catIcon:      { fontSize: 13, marginRight: 5 },
  catName:      { fontSize: 12, fontWeight: 'bold' },
  quoteBox:     { backgroundColor: '#E8F5E9', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center' },
  quoteSun:     { marginRight: 10 },
  quoteText:    { flex: 1, fontStyle: 'italic', color: '#388E3C', fontSize: 12, lineHeight: 18 },
  quoteHeart:   { marginLeft: 8 },
  footer:       { padding: 20, borderTopWidth: 1, borderColor: '#F0F0F0', backgroundColor: '#FAFAFA' },
});
