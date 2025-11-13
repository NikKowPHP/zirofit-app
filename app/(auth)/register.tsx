import { Alert, StyleSheet, View as SpacerView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { VStack } from '@/components/ui/Stack';
import { Text } from '@/components/ui/Text';
import { View } from '@/components/Themed';
import { useTokens } from '@/hooks/useTheme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { RoleSelector } from '@/components/ui/RoleSelector';
import { supabase } from '@/lib/supabase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'trainer'>('client');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const tokens = useTokens();

  const handleRegister = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
          },
        },
      });

      if (error) {
        throw error;
      }
      
      Alert.alert(
        'Registration Successful',
        'Please check your email to confirm your account, then log in.',
        [{ text: 'OK', onPress: () => router.push('/login') }]
      );
    } catch (e: any) {
      Alert.alert('Registration Error', e.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <VStack style={{ gap: tokens.spacing.lg, width: '80%' }}>
        <Text variant="h3" style={{ textAlign: 'center' }}>Create an Account</Text>
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
        
        <Text variant="body">I am a:</Text>
        <RoleSelector value={role} onValueChange={(val) => setRole(val as any)} />

        <SpacerView style={{ flex: 1 }} />

        <Button onPress={handleRegister} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
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
});
      