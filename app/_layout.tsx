import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ChildSessionProvider, useChildSession } from '@/contexts/ChildSessionContext';
import '@/lib/i18n';

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const { child } = useChildSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inProtectedGroup = segments[0] === '(parent)' ||
                             segments[0] === '(independent)' ||
                             segments[0] === '(child)';

    const inAuthFlow = segments[0] === 'role-selection' ||
                       segments[0] === 'parent-auth' ||
                       segments[0] === 'child-login' ||
                       segments[0] === 'index';

    if (!session && !child && inProtectedGroup) {
      router.replace('/role-selection');
    }
  }, [session, child, loading, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <ChildSessionProvider>
        <NavigationGuard>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="role-selection" />
            <Stack.Screen name="parent-auth" />
            <Stack.Screen name="child-login" />
            <Stack.Screen name="(parent)" />
            <Stack.Screen name="(child)" />
            <Stack.Screen name="(independent)" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </NavigationGuard>
      </ChildSessionProvider>
    </AuthProvider>
  );
}
