import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Player {
  id: string;
  username: string;
  profilePic?: string;
  isConnected?: boolean;
}

export default function NetworkingScreen() {
  const [recentPlayers, setRecentPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [networkSize, setNetworkSize] = useState(0);
  const { token } = useAuth();

  useEffect(() => {
    fetchRecentPlayers();
  }, []);

  const fetchRecentPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentPlayers(response.data);
      setNetworkSize(response.data.length);
    } catch (error) {
      console.error('Error fetching players:', error);
      Alert.alert('Error', 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (player: Player) => {
    Alert.alert(
      'Connect with Player',
      `Send a connection request to ${player.username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect',
          onPress: () => {
            Alert.alert('Success', `Connection request sent to ${player.username}`);
          },
        },
      ]
    );
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const renderPlayerItem = ({ item, index }: { item: Player; index: number }) => (
    <>
      <TouchableOpacity style={styles.playerCard} onPress={() => handleConnect(item)}>
        <View style={styles.playerInfo}>
          {item.profilePic ? (
            <Image source={{ uri: item.profilePic }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{getInitials(item.username)}</Text>
            </View>
          )}
          <Text style={styles.playerName}>{item.username}</Text>
        </View>
        <TouchableOpacity
          style={styles.connectButton}
          onPress={() => handleConnect(item)}
        >
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </TouchableOpacity>
      {index < recentPlayers.length - 1 && <View style={styles.separator} />}
    </>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.networkInfo}>
          <Text style={styles.networkLabel}>Network</Text>
          <Text style={styles.networkCount}>{networkSize}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Players</Text>
        </View>
      </View>

      <FlatList
        data={recentPlayers}
        renderItem={renderPlayerItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={fetchRecentPlayers}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#555" />
            <Text style={styles.emptyText}>No recent players</Text>
            <Text style={styles.emptySubtext}>
              Check in at courts to meet other players
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#FFF',
  },
  networkInfo: {
    alignItems: 'flex-start',
    paddingRight: 20,
  },
  networkLabel: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  networkCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 80,
    backgroundColor: '#DDD',
    marginRight: 20,
  },
  sectionHeader: {
    flex: 1,
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#5B7C99',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#5B7C99',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 16,
    flex: 1,
  },
  connectButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#8B5CF6',
    marginLeft: 80,
    opacity: 0.3,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
});
