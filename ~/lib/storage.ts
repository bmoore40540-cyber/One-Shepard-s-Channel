import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '@/types';

const STORAGE_KEY = 'osc_messages';

export async function getMessages(): Promise<Message[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveMessage(
  message: Omit<Message, 'id' | 'created_at'>
): Promise<Message> {
  const messages = await getMessages();
  const newMessage: Message = {
    ...message,
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    created_at: new Date().toISOString(),
  };
  messages.unshift(newMessage);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  return newMessage;
}

export async function getMessageById(id: string): Promise<Message | null> {
  const messages = await getMessages();
  return messages.find(m => m.id === id) || null;
}
