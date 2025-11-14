import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useColorScheme } from '@/components/useColorScheme';
import useAuthStore from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { AppThemeProvider } from '@/hooks/useTheme';
import { handleGoogleOAuthCallback } from '@/lib/auth/googleAuth';
import AppErrorBoundary from '@/components/ui/ErrorBoundary';
import { assetQueue } from '@/lib/services/assetUploadQueue';

const queryClient = new QueryClient();

// Custom Error Boundary for better offline error handling
function AppLayoutErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <AppErrorBoundary>
      {children}
    </AppErrorBoundary>
  );
}

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(app)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { setSession } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        // Handle Google OAuth callback if this is a Google user
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.identities?.some(identity => identity.provider === 'google')) {
          await handleGoogleOAuthCallback();
        }
      }
      setSession(session);

      // Initialize asset upload queue
      assetQueue.cleanup();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        // Handle Google OAuth callback if this is a Google user
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.identities?.some(identity => identity.provider === 'google')) {
          await handleGoogleOAuthCallback();
        }
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useAuthGuard();

  return (
    <AppLayoutErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppThemeProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            </Stack>
          </ThemeProvider>
        </AppThemeProvider>
      </QueryClientProvider>
    </AppLayoutErrorBoundary>
  );
}