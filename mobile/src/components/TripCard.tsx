import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function TripCard({ title, dates, category, imageSource, onPress }: { title: string; dates: string; category: string; imageSource?: string; onPress?: () => void }) {
  // Sélection des couleurs selon la catégorie
  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'culture': return { bg: '#FDEAE6', text: '#F05A45' };
      case 'plage': return { bg: '#E3F2FD', text: '#1976D2' };
      case 'aventure': return { bg: '#FFF3E0', text: '#E65100' };
      case 'nature': return { bg: '#E8F5E9', text: '#388E3C' };
      default: return { bg: '#F5F5F5', text: '#757575' };
    }
  };

  const catColors = getCategoryColor(category);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {imageSource ? (
          <Image source={{ uri: imageSource }} style={styles.image} />
        ) : (
          <View style={[styles.image, { backgroundColor: '#E0E0E0' }]} />
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Ionicons name="location-sharp" size={16} color="#F05A45" />
          <Text style={styles.title}>{title}</Text>
        </View>
        
        <View style={styles.dateRow}>
          <Feather name="calendar" size={12} color="#888" />
          <Text style={styles.dates}>{dates}</Text>
        </View>
        
        <View style={[styles.categoryBadge, { backgroundColor: catColors.bg }]}>
          <Text style={[styles.categoryText, { color: catColors.text }]}>{category}</Text>
        </View>
      </View>

      <View style={styles.arrowContainer}>
        <Feather name="chevron-right" size={20} color="#F05A45" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
    // Ombre légère
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333',
    marginLeft: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 2,
  },
  dates: { 
    fontSize: 12, 
    color: '#888',
    marginLeft: 6,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: { 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  arrowContainer: {
    paddingLeft: 10,
  }
});
