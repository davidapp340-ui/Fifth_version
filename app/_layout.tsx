import { useEffect } from 'react';
import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ChildSessionProvider, useChildSession } from '@/contexts/ChildSessionContext';
import '@/lib/i18n';

function AuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, loading: authLoading } = useAuth();
  const { child, loading: childLoading } = useChildSession();

  useEffect(() => {
    if (authLoading || childLoading) return;

    const isAuthenticated = profile !== null || child !== null;
    const isOnAuthRoute = pathname === '/' || pathname === '/role-selection' || pathname === '/parent-auth' || pathname === '/child-login';

    if (!isAuthenticated && !isOnAuthRoute) {
      router.replace('/role-selection');
    }
  }, [profile, child, authLoading, childLoading, pathname, router]);

  return null;
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <ChildSessionProvider>
        <AuthGuard />
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
      </ChildSessionProvider>
    </AuthProvider>
  );
}
