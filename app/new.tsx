import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { evaluateMessage } from '@/lib/filter';
import { saveMessage } from '@/lib/storage';

export default function NewMessageScreen() {
  const router = useRouter();
  const [contactAgreed, setContactAgreed] = useState(false);
  const [contactMethod, setContactMethod] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [practicalNextSteps, setPracticalNextSteps] = useState('');
  const [scriptureAnchors, setScriptureAnchors] = useState('');
  const [publishing, setPublishing] = useState(false);

  const canPublish = contactAgreed && contactMethod.trim().length > 0;

  async function handlePublish() {
    if (!canPublish) {
      Alert.alert('Required', 'You must agree to remain contactable and provide a contact method.');
      return;
    }

    setPublishing(true);
    const evaluation = evaluateMessage(body, practicalNextSteps);
    const notified = evaluation.passes;

    await saveMessage({
      user_id: 'local-user',
      title: title || null,
      body: body || null,
      practical_next_steps: practicalNextSteps || null,
      scripture_anchors: scriptureAnchors || null,
      status: notified ? 'notified' : 'published',
      contact_agreed: true,
      contact_method: contactMethod,
    });

    setPublishing(false);

    if (notified) {
      Alert.alert(
        'Message Notified',
        'This message passed the filter and received notification status.',
        [{ text: 'OK', onPress: () => router.replace('/') }]
      );
    } else {
      Alert.alert(
        'Message Published',
        'Published but did not receive broad notification.\n\n' + evaluation.reasons.join('\n'),
        [{ text: 'OK', onPress: () => router.replace('/') }]
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={styles.intro}>
          Anyone may post. Contactability is mandatory. Practical next steps are required for notification.
        </Text>

        {/* Mandatory Contact Block */}
        <View style={styles.mandatoryBox}>
          <Text style={styles.mandatoryTitle}>
            By posting you agree to remain contactable. We fear only God's wrath.
          </Text>

          <TouchableOpacity
            style={styles.checkRow}
            onPress={() => setContactAgreed(!contactAgreed)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, contactAgreed && styles.checkboxChecked]}>
              {contactAgreed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkLabel}>
              I agree to remain contactable by those who receive this message. I do this because we fear only God's wrath.
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Contact Method (required)</Text>
          <TextInput
            style={styles.input}
            value={contactMethod}
            onChangeText={setContactMethod}
            placeholder="In-app messaging preferred, or other method"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <Text style={styles.label}>Title (optional)</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Short title"
          placeholderTextColor="#9ca3af"
          maxLength={120}
        />

        <Text style={styles.label}>Core Message (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={body}
          onChangeText={setBody}
          placeholder="The main body of what is being said..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        <Text style={styles.label}>
          Practical Next Steps{' '}
          <Text style={styles.requiredNote}>Required for notification</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={practicalNextSteps}
          onChangeText={setPracticalNextSteps}
          placeholder="Concrete actions a person, pastor, or church can actually take..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Scripture or Source Anchors (optional)</Text>
        <TextInput
          style={styles.input}
          value={scriptureAnchors}
          onChangeText={setScriptureAnchors}
          placeholder="Key verses or study references"
          placeholderTextColor="#9ca3af"
        />

        <TouchableOpacity
          style={[styles.publishBtn, (!canPublish || publishing) && styles.publishBtnDisabled]}
          onPress={handlePublish}
          disabled={!canPublish || publishing}
        >
          <Text style={styles.publishBtnText}>
            {publishing ? 'Publishing…' : 'Publish Message'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  intro: { fontSize: 13, color: '#555', marginBottom: 16 },
  mandatoryBox: {
    backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#d1d5db',
    borderRadius: 10, padding: 14, marginBottom: 20,
  },
  mandatoryTitle: { fontSize: 13, fontWeight: '600', marginBottom: 12 },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  checkbox: {
    width: 22, height: 22, borderWidth: 2, borderColor: '#1e3a5f',
    borderRadius: 4, marginRight: 10, marginTop: 2, alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#1e3a5f' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '700' },
  checkLabel: { flex: 1, fontSize: 13, lineHeight: 18 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 4 },
  requiredNote: { fontSize: 11, fontWeight: '500', color: '#b45309' },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 15, marginBottom: 14, color: '#111',
  },
  textArea: { minHeight: 100, paddingTop: 10 },
  publishBtn: {
    backgroundColor: '#1e3a5f', paddingVertical: 14, borderRadius: 10,
    alignItems: 'center', marginTop: 10,
  },
  publishBtnDisabled: { opacity: 0.4 },
  publishBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
