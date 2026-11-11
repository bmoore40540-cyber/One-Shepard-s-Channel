import { useCallback, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl
} from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { getMessages } from '@/lib/storage';
import { Message } from '@/types';

export default function FeedScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await getMessages();
    setMessages(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.subtitle}>
          Messages with practical next steps can receive notification status.
        </Text>
        <View style={styles.navRow}>
          <Link href="/new" asChild>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>New Message</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/about" asChild>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>About</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No messages yet.</Text>
            <Link href="/new" asChild>
              <TouchableOpacity>
                <Text style={styles.link}>Post the first message →</Text>
              </TouchableOpacity>
            </Link>
          </View>
        }
        renderItem={({ item }) => (
          <Link href={`/message/${item.id}`} asChild>
            <TouchableOpacity style={styles.card}>
              <View style={styles.badgeRow}>
                <View style={[
                  styles.badge,
                  item.status === 'notified' ? styles.badgeNotified : styles.badgePublished
                ]}>
                  <Text style={[
                    styles.badgeText,
                    item.status === 'notified' ? styles.badgeTextNotified : styles.badgeTextPublished
                  ]}>
                    {item.status === 'notified' ? 'Notified' : 'Published'}
                  </Text>
                </View>
                <Text style={styles.date}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title || 'Untitled Message'}
              </Text>
              <Text style={styles.cardBody} numberOfLines={2}>
                {item.body || item.practical_next_steps}
              </Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  headerRow: { padding: 16, paddingBottom: 8 },
  subtitle: { color: '#555', fontSize: 13, marginBottom: 12 },
  navRow: { flexDirection: 'row', gap: 10 },
  primaryBtn: {
    backgroundColor: '#1e3a5f', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8,
  },
  primaryBtnText: { color: '#fff', fontWeight: '600' },
  secondaryBtn: {
    borderWidth: 1, borderColor: '#1e3a5f', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8,
  },
  secondaryBtnText: { color: '#1e3a5f', fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: '#888', marginBottom: 12 },
  link: { color: '#1e3a5f', fontWeight: '500' },
  card: {
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12,
    padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#e5e5e5',
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeNotified: { backgroundColor: '#ecfdf5' },
  badgePublished: { backgroundColor: '#f3f4f6' },
  badgeText: { fontSize: 11, fontWeight: '600' },
  badgeTextNotified: { color: '#065f46' },
  badgeTextPublished: { color: '#4b5563' },
  date: { fontSize: 11, color: '#9ca3af' },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardBody: { fontSize: 13, color: '#4b5563' },
});
