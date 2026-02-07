import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type Article = Database['public']['Tables']['articles']['Row'];

export default function IndependentScienceScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('articles')
        .select('id, created_at, image_url, category_he, category_en, title_he, title_en, subtitle_he, subtitle_en')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setArticles(data || []);
    } catch (err) {
      console.error('Error loading articles:', err);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleArticlePress = (articleId: string) => {
    router.push(`/(parent)/article/${articleId}` as any);
  };

  const getLocalizedField = (article: Article, field: 'title' | 'subtitle' | 'category') => {
    const lang = i18n.language;
    const fieldName = `${field}_${lang === 'he' ? 'he' : 'en'}` as keyof Article;
    return article[fieldName] as string;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Science</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F59E0B" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Science</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadArticles}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Science</Text>
        <Text style={styles.subtitle}>Learn about vision health</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {articles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No articles available yet</Text>
          </View>
        ) : (
          articles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.articleCard}
              onPress={() => handleArticlePress(article.id)}
              activeOpacity={0.7}
            >
              {article.image_url && (
                <Image source={{ uri: article.image_url }} style={styles.articleImage} />
              )}
              <View style={styles.articleContent}>
                <Text style={styles.articleCategory}>{getLocalizedField(article, 'category')}</Text>
                <Text style={styles.articleTitle}>{getLocalizedField(article, 'title')}</Text>
                <Text style={styles.articleSubtitle} numberOfLines={2}>
                  {getLocalizedField(article, 'subtitle')}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  articleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  articleImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#E5E7EB',
  },
  articleContent: {
    padding: 16,
  },
  articleCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  articleSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
