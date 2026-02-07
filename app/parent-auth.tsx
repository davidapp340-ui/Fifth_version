import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '@/lib/supabase';

export default function ParentAuthScreen() {
  const router = useRouter();
  const { defaultRole } = useLocalSearchParams<{ defaultRole?: string }>();
  const { signIn, signUp } = useAuth();
  const { t } = useTranslation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [visionCondition, setVisionCondition] = useState('unknown');
  const [wearsGlasses, setWearsGlasses] = useState(false);
  const [prescriptionLeft, setPrescriptionLeft] = useState('');
  const [prescriptionRight, setPrescriptionRight] = useState('');

  const isIndependent = defaultRole === 'independent';

  const handleSubmit = async () => {
    setError('');

    if (isSignUp && (!firstName.trim() || !lastName.trim())) {
      setError(t('auth.errors.fill_all_fields'));
      return;
    }

    if (!email || !password) {
      setError(t('auth.errors.fill_all_fields'));
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError(t('auth.errors.passwords_not_match'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.errors.password_too_short'));
      return;
    }

    setLoading(true);

    try {
      if (isSignUp && isIndependent) {
        const fullName = `${firstName.trim()} ${lastName.trim()}`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              role: 'independent',
            },
          },
        });

        if (error) {
          setError(error.message || t('auth.errors.auth_failed'));
          return;
        }

        if (data.user) {
          const { error: updateError } = await supabase
            .from('children')
            .update({
              birth_date: birthDate.toISOString().split('T')[0],
              gender,
              vision_condition: visionCondition,
              wears_glasses: wearsGlasses,
              current_prescription_left: wearsGlasses && prescriptionLeft ? parseFloat(prescriptionLeft) : null,
              current_prescription_right: wearsGlasses && prescriptionRight ? parseFloat(prescriptionRight) : null,
            })
            .eq('auth_user_id', data.user.id);

          if (updateError) {
            console.error('Error updating child profile:', updateError);
          }

          router.replace('/(independent)/home');
        }
      } else {
        const { error: authError } = isSignUp
          ? await signUp(email, password, firstName.trim(), lastName.trim())
          : await signIn(email, password);

        if (authError) {
          setError(authError.message || t('auth.errors.auth_failed'));
        } else {
          router.replace('/(parent)/home');
        }
      }
    } catch (err) {
      setError(t('auth.errors.unexpected_error'));
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#4F46E5" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>{t('auth.parent_login_title')}</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? t('auth.parent_signup_subtitle') : t('auth.parent_login_subtitle')}
          </Text>
        </View>

        <View style={styles.form}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {isSignUp && (
            <>
              <TextInput
                style={styles.input}
                placeholder={t('auth.first_name_placeholder')}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                editable={!loading}
              />

              <TextInput
                style={styles.input}
                placeholder={t('auth.last_name_placeholder')}
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                editable={!loading}
              />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder={t('auth.email_placeholder')}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder={t('auth.password_placeholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder={t('auth.confirm_password_placeholder')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!loading}
            />
          )}

          {isSignUp && isIndependent && (
            <>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
                disabled={loading}
              >
                <Text style={styles.datePickerText}>
                  Birth Date: {birthDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={birthDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setBirthDate(selectedDate);
                    }
                  }}
                  maximumDate={new Date()}
                />
              )}

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.segmentedControl}>
                  <TouchableOpacity
                    style={[styles.segment, gender === 'male' && styles.segmentActive]}
                    onPress={() => setGender('male')}
                    disabled={loading}
                  >
                    <Text style={[styles.segmentText, gender === 'male' && styles.segmentTextActive]}>
                      Male
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.segment, gender === 'female' && styles.segmentActive]}
                    onPress={() => setGender('female')}
                    disabled={loading}
                  >
                    <Text style={[styles.segmentText, gender === 'female' && styles.segmentTextActive]}>
                      Female
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.segment, gender === 'other' && styles.segmentActive]}
                    onPress={() => setGender('other')}
                    disabled={loading}
                  >
                    <Text style={[styles.segmentText, gender === 'other' && styles.segmentTextActive]}>
                      Other
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Vision Profile</Text>

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Vision Condition</Text>
                <View style={styles.visionGrid}>
                  {['myopia', 'hyperopia', 'amblyopia', 'strabismus', 'unknown'].map((condition) => (
                    <TouchableOpacity
                      key={condition}
                      style={[
                        styles.visionOption,
                        visionCondition === condition && styles.visionOptionActive,
                      ]}
                      onPress={() => setVisionCondition(condition)}
                      disabled={loading}
                    >
                      <Text
                        style={[
                          styles.visionOptionText,
                          visionCondition === condition && styles.visionOptionTextActive,
                        ]}
                      >
                        {condition.charAt(0).toUpperCase() + condition.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.label}>Wears Glasses</Text>
                <Switch
                  value={wearsGlasses}
                  onValueChange={setWearsGlasses}
                  disabled={loading}
                />
              </View>

              {wearsGlasses && (
                <>
                  <Text style={styles.label}>Prescription (Diopters)</Text>
                  <View style={styles.prescriptionRow}>
                    <View style={styles.prescriptionInput}>
                      <Text style={styles.prescriptionLabel}>Left Eye</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., -2.5"
                        value={prescriptionLeft}
                        onChangeText={setPrescriptionLeft}
                        keyboardType="numeric"
                        editable={!loading}
                      />
                    </View>
                    <View style={styles.prescriptionInput}>
                      <Text style={styles.prescriptionLabel}>Right Eye</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., -2.5"
                        value={prescriptionRight}
                        onChangeText={setPrescriptionRight}
                        keyboardType="numeric"
                        editable={!loading}
                      />
                    </View>
                  </View>
                </>
              )}
            </>
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isSignUp ? t('auth.sign_up_button') : t('auth.sign_in_button')}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setFirstName('');
              setLastName('');
              setConfirmPassword('');
            }}
            disabled={loading}
          >
            <Text style={styles.toggleButtonText}>
              {isSignUp ? t('auth.toggle_to_signin') : t('auth.toggle_to_signup')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#6B7280',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#4F46E5',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 24,
    marginBottom: 12,
  },
  datePickerText: {
    fontSize: 16,
    color: '#111827',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  segment: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentActive: {
    backgroundColor: '#4F46E5',
  },
  segmentText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  visionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  visionOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  visionOptionActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  visionOptionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  visionOptionTextActive: {
    color: '#4F46E5',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  prescriptionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  prescriptionInput: {
    flex: 1,
  },
  prescriptionLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
});
