import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useChildSession } from '@/contexts/ChildSessionContext';

export default function IndependentHomeScreen() {
  const { profile } = useAuth();
  const { child } = useChildSession();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>
          {profile?.first_name} {profile?.last_name}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Training Journey</Text>
          <Text style={styles.cardText}>
            Track your progress, complete exercises, and improve your vision health.
          </Text>
        </View>

        {child && (
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{child.total_points || 0}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{child.current_streak || 0}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{child.path_day || 1}</Text>
              <Text style={styles.statLabel}>Current Day</Text>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <Text style={styles.cardText}>
            Use the tabs below to navigate to your training path, exercise gallery, science articles, or settings.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});
