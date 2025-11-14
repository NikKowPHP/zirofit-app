import { Alert, StyleSheet, View as SpacerView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { VStack } from '@/components/ui/Stack';
import { Text } from '@/components/ui/Text';
import { Text as ThemedText, View } from '@/components/Themed';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GoogleAuthButton } from '@/components/ui/GoogleAuthButton';
import { useTokens } from '@/hooks/useTheme';
import { supabase } from '@/lib/supabase';
import { signInWithGoogle } from '@/lib/auth/googleAuth';
import { getMe } from '@/lib/api';
import useAuthStore from '@/store/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const { setProfile } = useAuthStore();
  const tokens = useTokens();

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        Alert.alert('Google Sign In Error', result.error);
      }
      // Note: Session handling is managed by the auth listener in the main layout
    } catch (error: any) {
      Alert.alert('Google Sign In Error', error.message || 'An unexpected error occurred');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Login Error', error.message);
    } else {
      try {
        // On success, fetch user profile which contains the role
        const profile = await getMe();
        if (profile) {
          setProfile(profile);
        }
        // The root navigator will handle redirection automatically
      } catch (e: any) {
        Alert.alert('Profile Error', e.message);
      }
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <VStack style={{ gap: tokens.spacing.lg, width: '80%' }}>
        <Text variant="h3" style={{ textAlign: 'center' }}>Welcome Back</Text>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <GoogleAuthButton
          onPress={handleGoogleSignIn}
          loading={googleLoading}
          variant="signin"
          disabled={loading}
        />
        <Text variant="body" style={{ textAlign: 'center', marginVertical: tokens.spacing.sm }}>
          or
        </Text>
        <Button onPress={handleLogin} disabled={loading || googleLoading}>
          {loading ? 'Signing in...' : 'Sign In with Email'}
        </Button>
        <SpacerView style={{ flex: 1 }} />
        <Text variant="body" style={{ textAlign: 'center' }} onPress={() => router.push('/register')}>
          Don't have an account? <ThemedText style={styles.link}>Sign up</ThemedText>
        </Text>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    color: '#2e78b7',
  }
});
      