import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { getMessageById } from '@/lib/storage';
import { Message } from '@/types';

export default function MessageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getMessageById(id);
      setMessage(data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e3a5f" />
      </View>
    );
  }

  if (!message) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Message not found.</Text>
        <Link href="/" style={styles.link}>← Return to Feed</Link>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={styles.badgeRow}>
        <View style={[
          styles.badge,
          message.status === 'notified' ? styles.badgeNotified : styles.badgePublished
        ]}>
          <Text style={[
            styles.badgeText,
            message.status === 'notified' ? styles.badgeTextNotified : styles.badgeTextPublished
          ]}>
            {message.status === 'notified' ? 'Notified' : 'Published'}
          </Text>
        </View>
        <Text style={styles.date}>
          {new Date(message.created_at).toLocaleString()}
        </Text>
      </View>

      <Text style={styles.title}>{message.title || 'Untitled Message'}</Text>

      {message.body ? (
        <Text style={styles.body}>{message.body}</Text>
      ) : null}

      {message.practical_next_steps ? (
        <View style={styles.stepsBox}>
          <Text style={styles.stepsTitle}>Practical Next Steps</Text>
          <Text style={styles.stepsText}>{message.practical_next_steps}</Text>
        </View>
      ) : null}

      {message.scripture_anchors ? (
        <Text style={styles.anchors}>
          <Text style={{ fontWeight: '600' }}>Scripture / Sources: </Text>
          {message.scripture_anchors}
        </Text>
      ) : null}

      <View style={styles.contactBox}>
        <Text style={styles.contactTitle}>Contact the Poster</Text>
        <Text style={styles.contactNote}>
          Every poster on this channel has agreed to remain contactable. We fear only God's wrath.
        </Text>
        <Text style={styles.contactMethod}>
          Contact method: <Text style={{ fontWeight: '600' }}>{message.contact_method}</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: { color: '#6b7280', marginBottom: 12 },
  link: { color: '#1e3a5f', fontWeight: '500' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  badgeNotified: { backgroundColor: '#ecfdf5' },
  badgePublished: { backgroundColor: '#f3f4f6' },
  badgeText: { fontSize: 11, fontWeight: '600' },
  badgeTextNotified: { color: '#065f46' },
  badgeTextPublished: { color: '#4b5563' },
  date: { fontSize: 12, color: '#9ca3af' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16, color: '#111' },
  body: { fontSize: 15, lineHeight: 22, color: '#1f2937', marginBottom: 20 },
  stepsBox: {
    backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#a7f3d0',
    borderRadius: 10, padding: 14, marginBottom: 20,
  },
  stepsTitle: { fontSize: 13, fontWeight: '700', color: '#065f46', marginBottom: 6 },
  stepsText: { fontSize: 14, lineHeight: 20, color: '#064e3b' },
  anchors: { fontSize: 13, color: '#4b5563', marginBottom: 20 },
  contactBox: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 14,
  },
  contactTitle: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  contactNote: { fontSize: 13, color: '#6b7280', marginBottom: 8 },
  contactMethod: { fontSize: 14 },
});
