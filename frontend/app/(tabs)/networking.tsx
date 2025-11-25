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

type ViewMode = 'network' | 'recent';

export default function NetworkingScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('network');
  const [networkPlayers, setNetworkPlayers] = useState<Player[]>([]);
  const [recentPlayers, setRecentPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [viewMode]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (viewMode === 'network') {
        await fetchNetwork();
      } else {
        await fetchRecentPlayers();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchNetwork = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/network/connections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNetworkPlayers(response.data);
    } catch (error) {
      console.error('Error fetching network:', error);
      Alert.alert('Error', 'Failed to load network');
    }
  };

  const fetchRecentPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/network/recent-players`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentPlayers(response.data);
    } catch (error) {
      console.error('Error fetching recent players:', error);
      Alert.alert('Error', 'Failed to load recent players');
    }
  };

  const handleSendRequest = async (player: Player) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/network/friend-request`,
        { toUserId: player.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.status === 'success') {
        Alert.alert('Success', `Friend request sent to ${player.username}!`);
        fetchData(); // Refresh the list
      } else if (response.data.status === 'already_connected') {
        Alert.alert('Already Connected', response.data.message);
      } else {
        Alert.alert('Info', response.data.message);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const renderPlayerItem = ({ item, index }: { item: Player; index: number }) => {
    const players = viewMode === 'network' ? networkPlayers : recentPlayers;
    
    return (
      <>
        <TouchableOpacity style={styles.playerCard}>
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
          {viewMode === 'recent' && !item.isConnected && (
            <TouchableOpacity
              style={styles.connectButton}
              onPress={() => handleSendRequest(item)}
            >
              <Ionicons name="add" size={24} color="#000" />
            </TouchableOpacity>
          )}
          {item.isConnected && (
            <View style={styles.connectedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
          )}
        </TouchableOpacity>
        {index < players.length - 1 && <View style={styles.separator} />}
      </>
    );
  };

  const currentPlayers = viewMode === 'network' ? networkPlayers : recentPlayers;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerSection}
          onPress={() => setViewMode('network')}
        >
          <View style={[styles.networkInfo, viewMode === 'network' && styles.activeSection]}>
            <Text style={[styles.networkLabel, viewMode === 'network' && styles.activeLabel]}>
              Network
            </Text>
            <Text style={[styles.networkCount, viewMode === 'network' && styles.activeCount]}>
              {networkPlayers.length}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.headerSection}
          onPress={() => setViewMode('recent')}
        >
          <View style={[styles.sectionHeader, viewMode === 'recent' && styles.activeSection]}>
            <Text style={[styles.sectionTitle, viewMode === 'recent' && styles.activeSectionTitle]}>
              Recent Players
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : (
        <FlatList
          data={currentPlayers}
          renderItem={renderPlayerItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={fetchData}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name={viewMode === 'network' ? 'people-outline' : 'basketball-outline'}
                size={64}
                color="#555"
              />
              <Text style={styles.emptyText}>
                {viewMode === 'network'
                  ? 'No connections yet'
                  : 'No recent players'}
              </Text>
              <Text style={styles.emptySubtext}>
                {viewMode === 'network'
                  ? 'Send friend requests to build your network'
                  : user?.isPublic
                  ? 'Check in at courts to meet other public players'
                  : 'Switch to public mode in Profile to be discoverable'}
              </Text>
            </View>
          }
        />
      )}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#FFF',
  },
  headerSection: {
    flex: 1,
  },
  networkInfo: {
    alignItems: 'flex-start',
    paddingRight: 20,
    opacity: 0.5,
  },
  activeSection: {
    opacity: 1,
  },
  networkLabel: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#000',
  },
  networkCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 4,
  },
  activeCount: {
    color: '#000',
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
    opacity: 0.5,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#999',
  },
  activeSectionTitle: {
    color: '#000',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    flexGrow: 1,
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
  connectedBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    paddingHorizontal: 32,
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
    lineHeight: 20,
  },
});
