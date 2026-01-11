import { View, Text, StyleSheet } from 'react-native';
import { Map } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function PathScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('child_navigation.path_screen.title')}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.constructionCard}>
          <Map size={64} color="#10B981" />
          <Text style={styles.constructionTitle}>
            {t('child_navigation.path_screen.construction_title')}
          </Text>
          <Text style={styles.constructionMessage}>
            {t('child_navigation.path_screen.construction_message')}
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
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  constructionCard: {
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
  constructionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  constructionMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
