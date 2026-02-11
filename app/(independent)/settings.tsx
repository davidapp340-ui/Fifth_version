import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useChildSession } from '@/contexts/ChildSessionContext';
import { Globe, LogOut, User, MessageCircle, Globe2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function IndependentSettingsScreen() {
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const { clearChildSession } = useChildSession();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) {
      router.replace('/role-selection');
    }
  }, [profile]);

  const getInitials = (firstName: string, lastName: string): string => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  };

  const handleLanguageChange = async () => {
    const newLang = i18n.language === 'en' ? 'he' : 'en';
    await i18n.changeLanguage(newLang);
  };

  const handleWhatsAppSupport = () => {
    const phoneNumber = '972501234567';
    const message = 'Hi, I need help with Zoomi Fitness';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert(
        t('settings.toggle_subscription.error_title'),
        t('settings.errors.whatsapp_not_installed')
      );
    });
  };

  const handleVisitWebsite = () => {
    const websiteUrl = 'https://zoomi.fitness';
    Linking.openURL(websiteUrl).catch(() => {
      Alert.alert(
        t('settings.toggle_subscription.error_title'),
        t('settings.errors.website_failed')
      );
    });
  };

  const handleSignOut = async () => {
    Alert.alert(
      t('independent.settings.sign_out'),
      t('independent.settings.sign_out_confirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('independent.settings.sign_out'),
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await clearChildSession();
              await signOut();
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert(t('common.error'), 'Failed to sign out');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (!profile) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('independent.tabs.settings')}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('independent.settings.profile')}</Text>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(profile?.first_name || '', profile?.last_name || '')}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {profile?.first_name} {profile?.last_name}
              </Text>
              <Text style={styles.profileEmail}>{profile?.email}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{t('independent.settings.independent_user')}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('independent.settings.preferences')}</Text>

          <TouchableOpacity style={styles.settingItem} onPress={handleLanguageChange}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Globe size={24} color="#F59E0B" />
              </View>
              <View>
                <Text style={styles.settingTitle}>{t('settings.language.title')}</Text>
                <Text style={styles.settingSubtitle}>
                  {i18n.language === 'en' ? t('settings.language.current_english') : t('settings.language.current_hebrew')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.sections.support_info')}</Text>

          <TouchableOpacity style={styles.settingItem} onPress={handleWhatsAppSupport}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, styles.whatsappIcon]}>
                <MessageCircle size={24} color="#10B981" />
              </View>
              <View>
                <Text style={styles.settingTitle}>{t('settings.support.whatsapp_title')}</Text>
                <Text style={styles.settingSubtitle}>{t('settings.support.whatsapp_description')}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleVisitWebsite}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, styles.websiteIcon]}>
                <Globe2 size={24} color="#3B82F6" />
              </View>
              <View>
                <Text style={styles.settingTitle}>{t('settings.support.website_title')}</Text>
                <Text style={styles.settingSubtitle}>{t('settings.support.website_description')}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('independent.settings.account')}</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleSignOut}
            disabled={loading}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, styles.dangerIcon]}>
                {loading ? (
                  <ActivityIndicator size="small" color="#EF4444" />
                ) : (
                  <LogOut size={24} color="#EF4444" />
                )}
              </View>
              <View>
                <Text style={[styles.settingTitle, styles.dangerText]}>{t('independent.settings.sign_out')}</Text>
                <Text style={styles.settingSubtitle}>
                  {t('independent.settings.sign_out_confirm')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('independent.settings.app_info')}</Text>
          <Text style={styles.footerSubtext}>{t('independent.settings.version')}</Text>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dangerIcon: {
    backgroundColor: '#FEE2E2',
  },
  whatsappIcon: {
    backgroundColor: '#D1FAE5',
  },
  websiteIcon: {
    backgroundColor: '#DBEAFE',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  dangerText: {
    color: '#EF4444',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  footerSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
