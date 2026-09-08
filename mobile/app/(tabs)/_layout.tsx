import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#F05A45', // Corail/Orange
      tabBarInactiveTintColor: '#A0A0A0', // Gris clair
      headerShown: false,
      tabBarStyle: {
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        height: 60,
        paddingBottom: 10,
        paddingTop: 5,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600'
      }
    }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }: { color: string }) => <Feather name="home" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="carte" 
        options={{
          title: 'Carte',
          tabBarIcon: ({ color }: { color: string }) => <Feather name="map" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="carnet" 
        options={{
          title: 'Carnet',
          tabBarIcon: ({ color }: { color: string }) => <Feather name="book-open" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="profil" 
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }: { color: string }) => <Feather name="user" size={24} color={color} />
        }} 
      />
    </Tabs>
  );
}
