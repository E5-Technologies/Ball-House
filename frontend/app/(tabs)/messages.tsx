import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { Colors, BorderRadius, Spacing } from '../../constants/theme';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Conversation {
  userId: string;
  username: string;
  profilePic?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface User {
  id: string;
  username: string;
  profilePic?: string;
}

export default function MessagesScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const { token, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchConversations();
    fetchUsers();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => {
        // Navigate to chat screen with user
        console.log('Open chat with:', item.userId);
      }}
    >
      {item.profilePic ? (
        <Image source={{ uri: item.profilePic }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{getInitials(item.username)}</Text>
        </View>
      )}

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => {
        setShowNewMessageModal(false);
        console.log('Start chat with:', item.id);
      }}
    >
      {item.profilePic ? (
        <Image source={{ uri: item.profilePic }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{getInitials(item.username)}</Text>
        </View>
      )}
      <Text style={styles.username}>{item.username}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.privateToggle}>
          <Text style={styles.privateLabel}>Private</Text>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
            trackColor={{ false: '#D1D1D1', true: Colors.primary }}
            thumbColor="#FFF"
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={80} color="#CCC" />
          <Text style={styles.emptyTitle}>No Messages Yet</Text>
          <Text style={styles.emptyText}>
            Start a conversation with other players
          </Text>
          <TouchableOpacity
            style={styles.newMessageButton}
            onPress={() => setShowNewMessageModal(true)}
          >
            <Ionicons name="add" size={24} color="#FFF" />
            <Text style={styles.newMessageButtonText}>New Message</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.userId}
            renderItem={renderConversationItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Floating New Message Button */}
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => setShowNewMessageModal(true)}
          >
            <Ionicons name="create-outline" size={28} color="#FFF" />
          </TouchableOpacity>
        </>
      )}

      {/* New Message Modal */}
      {showNewMessageModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Message</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowNewMessageModal(false)}
              >
                <Ionicons name="close" size={28} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              renderItem={renderUserItem}
              contentContainerStyle={styles.userListContent}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
  },
  privateToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  privateLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  newMessageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  newMessageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  listContent: {
    paddingVertical: Spacing.sm,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: Spacing.md,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  timestamp: {
    fontSize: 13,
    color: '#999',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
  },
  userListContent: {
    paddingVertical: Spacing.sm,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
});
