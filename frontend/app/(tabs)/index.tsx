import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Court {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  hours: string;
  phoneNumber: string;
  rating: number;
  currentPlayers: number;
  image?: string;
}

export default function MapScreen() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getLocation();
    fetchCourts();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to show nearby courts');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const fetchCourts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/courts`);
      setCourts(response.data);
    } catch (error) {
      console.error('Error fetching courts:', error);
      Alert.alert('Error', 'Failed to load courts');
    } finally {
      setLoading(false);
    }
  };

  const getPlayerColor = (count: number) => {
    if (count === 0) return '#555';
    if (count <= 5) return '#4CAF50';
    if (count <= 15) return '#FFC107';
    if (count <= 25) return '#FF9800';
    return '#F44336';
  };

  const getDistance = (court: Court) => {
    if (!location) return null;
    
    const lat1 = location.coords.latitude;
    const lon1 = location.coords.longitude;
    const lat2 = court.latitude;
    const lon2 = court.longitude;
    
    const R = 3959; // Earth radius in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance.toFixed(1);
  };

  const filteredCourts = courts.filter(court =>
    court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    court.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCourtItem = ({ item }: { item: Court }) => {
    const distance = getDistance(item);
    const playerColor = getPlayerColor(item.currentPlayers);

    return (
      <TouchableOpacity
        style={styles.courtCard}
        onPress={() => router.push(`/court/${item.id}`)}
      >
        <View style={styles.courtHeader}>
          <View style={styles.courtInfo}>
            <Text style={styles.courtName}>{item.name}</Text>
            <Text style={styles.courtAddress}>{item.address}</Text>
          </View>
          {distance && (
            <View style={styles.distanceContainer}>
              <Ionicons name="location" size={16} color="#4A90E2" />
              <Text style={styles.distanceText}>{distance} mi</Text>
            </View>
          )}
        </View>

        <View style={styles.courtDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#888" />
            <Text style={styles.detailText}>{item.hours}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.detailText}>{item.rating.toFixed(1)}</Text>
          </View>

          <View style={[styles.playerBadge, { backgroundColor: playerColor }]}>
            <Ionicons name="people" size={16} color="#FFF" />
            <Text style={styles.playerCount}>{item.currentPlayers}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courts..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredCourts}
        renderItem={renderCourtItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={fetchCourts}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="basketball-outline" size={64} color="#555" />
            <Text style={styles.emptyText}>No courts found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: '#FFF',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  courtCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  courtHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  courtInfo: {
    flex: 1,
  },
  courtName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  courtAddress: {
    fontSize: 14,
    color: '#888',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  courtDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#888',
  },
  playerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 'auto',
  },
  playerCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    marginTop: 16,
  },
});
