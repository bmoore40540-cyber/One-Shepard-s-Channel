import { ScrollView, Text, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text style={styles.title}>About One Shepherd's Channel</Text>

      <Text style={styles.para}>
        One Shepherd's Channel is a free platform for messages concerning Christ and God.
        It exists so that those who believe they have received something of spiritual weight
        may publish it, and so that those who choose to listen may be notified when a message
        carries practical direction.
      </Text>

      <Text style={styles.heading}>Permanent Rules</Text>
      <Text style={styles.bullet}>• Completely free forever</Text>
      <Text style={styles.bullet}>• No advertisements of any kind</Text>
      <Text style={styles.bullet}>• No sales, donations prompts, or monetization</Text>
      <Text style={styles.bullet}>• Anyone may post</Text>
      <Text style={styles.bullet}>• Contactability is mandatory for every poster</Text>
      <Text style={styles.bullet}>• We fear only God's wrath</Text>

      <Text style={styles.heading}>How Notification Works</Text>
      <Text style={styles.para}>
        A message receives notification status only when it meets the medium-strength filter:
        clear anchoring in God or Christ, truth held together with love, avoidance of domination
        or pure private opinion, and concrete practical next steps that can actually be done.
      </Text>

      <Text style={styles.heading}>Governing Direction</Text>
      <Text style={styles.para}>
        The platform is guided by the principle of Livable Truth — truth that is strong enough
        to require repair and humble enough to remain correctable, carried in the spirit of the
        Golden Rule, and oriented toward changed conduct rather than mere statement.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  heading: { fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 8 },
  para: { fontSize: 14, lineHeight: 21, color: '#374151', marginBottom: 8 },
  bullet: { fontSize: 14, lineHeight: 22, color: '#374151', marginLeft: 4 },
});
