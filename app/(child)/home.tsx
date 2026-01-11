import { View, Text, StyleSheet } from 'react-native';
import { useChildSession } from '@/contexts/ChildSessionContext';
import { useTranslation } from 'react-i18next';

export default function ChildHomeScreen() {
  const { child } = useChildSession();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('child_home.title')}</Text>
        <Text style={styles.subtitle}>{t('child_home.welcome', { childName: child?.name })}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>
            {t('child_navigation.home_screen.placeholder')}
          </Text>
        </View>
      </View>
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
    color: '#10B981',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  placeholderCard: {
    backgroundColor: '#FFFFFF',
    padding: 48,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#10B981',
    textAlign: 'center',
  },
});
