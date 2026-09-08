import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../src/components/Button';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // On simule des données statiques pour l'instant
  const title = "Marrakech";
  const dates = "12 juin 2026 — 16 juin 2026";
  const category = "Culture";
  const mainImage = "https://images.unsplash.com/photo-1597212618440-806262de4f6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détail du voyage</Text>
        <TouchableOpacity>
          <Feather name="more-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: mainImage }} style={styles.coverImage} />
          <TouchableOpacity style={styles.navLeft}>
            <Feather name="chevron-left" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navRight}>
            <Feather name="chevron-right" size={20} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.locationBadge}>
            <Ionicons name="location-sharp" size={14} color="#F05A45" />
            <Text style={styles.locationText}>{title}</Text>
          </View>
          
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>1/6</Text>
          </View>
        </View>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.categoryBadge}>
            <Feather name="box" size={12} color="#F05A45" style={{marginRight: 4}} />
            <Text style={styles.categoryText}>{category}</Text>
          </View>
          <View style={styles.dateBadge}>
            <Feather name="calendar" size={14} color="#A0A0A0" />
            <Text style={styles.dateText}>{dates}</Text>
          </View>
        </View>

        {/* Section Impressions */}
        <View style={styles.sectionHeader}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Feather name="sun" size={16} color="#F05A45" style={{marginRight: 6}} />
            <Text style={styles.sectionTitle}>Mes impressions</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.editText}>Éditer</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.paragraph}>
          Marrakech, c'est une ville magique ! Entre les souks colorés, les palais, la médina et la chaleur de ses habitants, chaque coin de rue raconte une histoire. J'ai adoré me perdre dans les ruelles et découvrir les petits cafés cachés. La lumière du soir sur la place Jemaa el-Fna est tout simplement incroyable !
        </Text>

        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>
            « La lumière dorée de la fin d'après-midi sur la place des épices est un souvenir que je garderai toujours. »
          </Text>
        </View>

        {/* Section Photos */}
        <View style={[styles.sectionHeader, { marginTop: 25 }]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Feather name="camera" size={16} color="#388E3C" style={{marginRight: 6}} />
            <Text style={styles.sectionTitle}>Photos du voyage</Text>
          </View>
        </View>

        <View style={styles.photosGrid}>
          <Image source={{ uri: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" }} style={styles.thumbImage} />
          <Image source={{ uri: "https://images.unsplash.com/photo-1549424911-38148e6c4ea2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" }} style={styles.thumbImage} />
          <Image source={{ uri: "https://images.unsplash.com/photo-1577147443647-81856d5151af?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" }} style={styles.thumbImage} />
          <TouchableOpacity style={styles.morePhotosBtn}>
            <Feather name="chevron-right" size={24} color="#F05A45" />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryBtn}>
          <Feather name="edit-2" size={16} color="#333" style={{marginRight: 8}} />
          <Text style={styles.secondaryBtnText}>Modifier le voyage</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn}>
          <Feather name="trash-2" size={18} color="#F05A45" />
        </TouchableOpacity>
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
    marginBottom: 15,
  },
  backBtn: { padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A237E' },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  coverContainer: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  navLeft: {
    position: 'absolute',
    left: 10,
    top: '45%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    padding: 5,
  },
  navRight: {
    position: 'absolute',
    right: 10,
    top: '45%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    padding: 5,
  },
  locationBadge: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  locationText: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginLeft: 5 },
  counterBadge: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  counterText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDEAE6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 15,
  },
  categoryText: { color: '#F05A45', fontWeight: 'bold', fontSize: 12 },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: { color: '#A0A0A0', fontSize: 12, marginLeft: 6 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  editText: {
    fontSize: 14,
    color: '#F05A45',
    fontWeight: '600',
  },
  paragraph: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
    textAlign: 'justify'
  },
  quoteBox: {
    backgroundColor: '#FFF3E0', // fond orangé très clair
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#F05A45',
  },
  quoteText: {
    fontStyle: 'italic',
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  photosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  thumbImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  morePhotosBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 10,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteBtn: {
    width: 50,
    height: 50,
    backgroundColor: '#FDEAE6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  }
});
