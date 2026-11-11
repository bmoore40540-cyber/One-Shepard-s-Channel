import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { askGrok } from '../lib/grok';

interface Message {
  id: string;
  text: string;
  sender: string;
  category: 'General' | 'Prayer' | 'Announcements' | 'Grok AI';
  timestamp: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Welcome to One Shepherd Channel!', sender: 'System', category: 'Announcements', timestamp: '10:00 AM' },
    { id: '2', text: 'Please pray for our upcoming community gathering.', sender: 'John', category: 'Prayer', timestamp: '10:05 AM' },
  ]);

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(false);

  // --- FILTER LOGIC ---
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || msg.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'User',
      category: 'General',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [newMessage, ...prev]);
    setInputText('');
  };

  const handleAskGrok = async () => {
    if (!inputText.trim()) return;
    const userPrompt = inputText;
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userPrompt,
      sender: 'User',
      category: 'General',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [userMsg, ...prev]);
    setInputText('');
    setLoading(true);

    try {
      const grokReply = await askGrok(userPrompt, 'grok-4.7');
      const grokMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: grokReply,
        sender: 'Grok AI',
        category: 'Grok AI',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [grokMsg, ...prev]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${err.message || 'Failed to communicate with Grok.'}`,
        sender: 'System',
        category: 'Announcements',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [errorMsg, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>One Shepherd's Channel</Text>

      {/* SEARCH BAR */}
      <TextInput
        style={styles.searchInput}
        placeholder="Filter messages or sender..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* FILTER BUTTONS */}
      <View style={styles.filterRow}>
        {['All', 'General', 'Prayer', 'Announcements', 'Grok AI'].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* MESSAGES LIST */}
      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageCard}>
            <View style={styles.messageHeader}>
              <Text style={styles.senderText}>{item.sender}</Text>
              <Text style={styles.categoryBadge}>{item.category}</Text>
            </View>
            <Text style={styles.messageBody}>{item.text}</Text>
            <Text style={styles.timeText}>{item.timestamp}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No messages match your filter.</Text>}
      />

      {/* INPUT AREA */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Write message or query..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.grokButton} onPress={handleAskGrok} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.sendButtonText}>Ask Grok</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f6', paddingHorizontal: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginVertical: 12, color: '#111' },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  filterRow: { flexDirection: 'row', marginBottom: 12 },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    marginRight: 6,
  },
  filterChipActive: { backgroundColor: '#007AFF' },
  chipText: { fontSize: 12, color: '#333' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  messageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  senderText: { fontWeight: 'bold', color: '#333' },
  categoryBadge: { fontSize: 11, color: '#007AFF', backgroundColor: '#eef6ff', paddingHorizontal: 6, borderRadius: 4 },
  messageBody: { fontSize: 15, color: '#222', marginVertical: 4 },
  timeText: { fontSize: 11, color: '#999', textAlign: 'right' },
  emptyText: { textAlign: 'center', color: '#777', marginTop: 20 },
  inputContainer: { flexDirection: 'row', paddingVertical: 10, borderTopWidth: 1, borderColor: '#ddd' },
  messageInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginLeft: 6,
  },
  grokButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginLeft: 6,
  },
  sendButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});
