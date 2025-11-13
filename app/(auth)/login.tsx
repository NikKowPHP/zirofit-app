import { Alert, StyleSheet, View as SpacerView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { VStack } from '@/components/ui/Stack';
import { Text } from '@/components/ui/Text';
import { Text as ThemedText, View } from '@/components/Themed';
import { useTokens } from '@/hooks/useTheme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { getMe } from '@/lib/api';
import useAuthStore from '@/store/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setProfile } = useAuthStore();
  const tokens = useTokens();

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
        <Button onPress={handleLogin} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
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
      