import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import { createTrip } from '../src/services/api';

const CATEGORIES = ['Culture', 'Nature', 'Plage', 'Aventure', 'Gastronomie', 'Ville'];

export default function AddTripScreen() {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState('');
  const [desc, setDesc] = useState('');
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const getCatColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'culture': return { bg: '#FDEAE6', text: '#F05A45' };
      case 'plage': return { bg: '#E3F2FD', text: '#1976D2' };
      case 'aventure': return { bg: '#FFF3E0', text: '#E65100' };
      case 'nature': return { bg: '#E8F5E9', text: '#388E3C' };
      case 'gastronomie': return { bg: '#FFFDE7', text: '#FBC02D' };
      case 'ville': return { bg: '#FCE4EC', text: '#C2185B' };
      default: return { bg: '#F5F5F5', text: '#757575' };
    }
  };

  const handleSave = async () => {
    if (!title || !destination) {
      alert("Le titre et la destination sont obligatoires !");
      return;
    }
    setLoading(true);
    try {
      await createTrip({
        title,
        destination,
        startDate,
        endDate,
        description: desc,
        category: selectedCat || 'Culture'
      });
      router.back();
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
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
        <TouchableOpacity>
          <Feather name="send" size={20} color="#F05A45" />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Nouveau voyage, nouvelles aventures !</Text>

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
          <View style={{flex: 1, marginRight: 10}}>
            <Input 
              label="Date de départ" 
              placeholder="jj/mm/aaaa" 
              iconName="calendar" 
              value={startDate}
              onChangeText={setStartDate}
            />
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
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
          label="Mots personnalisés" 
          placeholder="Raconte ton voyage, tes impressions, les endroits que tu as visités, les meilleures adresses..." 
          iconName="message-square" 
          multiline={true}
          maxLength={100}
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
                    isSelected && { borderWidth: 1, borderColor: colors.text }
                  ]}
                >
                  <Text style={[styles.categoryText, { color: colors.text }]}>{cat}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Citation Box */}
        <View style={styles.quoteBox}>
          <Feather name="sun" size={24} color="#FBC02D" style={styles.quoteIconLeft} />
          <Text style={styles.quoteText}>« Voyager, c'est donner un sens à sa vie, c'est donner de la couleur à ses souvenirs. »</Text>
          <Feather name="heart" size={16} color="#F05A45" style={styles.quoteIconRight} />
        </View>

      </ScrollView>

      {/* Bouton fixe en bas */}
      <View style={styles.footer}>
        <Button 
          title={loading ? "Enregistrement..." : "Enregistrer le voyage"} 
          onPress={handleSave} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backBtn: { padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A237E' },
  subtitle: {
    color: '#A0A0A0',
    fontSize: 14,
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: 20,
    textAlign: 'center'
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  categorySection: { marginBottom: 20 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  quoteBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quoteIconLeft: { position: 'absolute', top: -10, left: -5 },
  quoteText: {
    flex: 1,
    fontStyle: 'italic',
    color: '#388E3C',
    textAlign: 'center',
    fontSize: 12,
  },
  quoteIconRight: { position: 'absolute', bottom: 10, right: 10 },
  footer: {
    padding: 20,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderColor: '#F0F0F0'
  }
});
