import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { useTheme } from '@/hooks/useTheme';
import { useTokens } from '@/hooks/useTheme';
import { GoogleAuthErrors } from '@/lib/auth/googleAuth';

interface GoogleAuthButtonProps {
  onPress: () => void;
  loading?: boolean;
  variant?: 'signin' | 'signup';
  disabled?: boolean;
  onError?: (error: string) => void;
}

export function GoogleAuthButton({ 
  onPress, 
  loading = false, 
  variant = 'signin',
  disabled = false,
  onError 
}: GoogleAuthButtonProps) {
  const theme = useTheme();
  const tokens = useTokens();

  const handlePress = async () => {
    if (disabled || loading) return;
    
    try {
      await onPress();
    } catch (error: any) {
      console.error(`${variant === 'signin' ? 'Google Sign In' : 'Google Sign Up'} Error:`, error);
      const errorMessage = error.message || `${variant === 'signin' ? 'Sign In' : 'Sign Up'} failed`;
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const getButtonStyle = () => {
    if (disabled || loading) {
      return [
        styles.button,
        {
          backgroundColor: theme.muted,
          borderColor: theme.muted,
        }
      ];
    }
    
    return [
      styles.button,
      {
        backgroundColor: theme.background,
        borderColor: theme.border,
        borderWidth: 1,
      }
    ];
  };

  const getTextStyle = () => {
    if (disabled || loading) {
      return { color: theme.mutedForeground };
    }
    return { color: theme.foreground };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {/* Google G Logo */}
        <View style={[
          styles.googleLogo,
          { backgroundColor: loading ? theme.muted : '#4285F4' }
        ]}>
          <Text style={styles.logoText}>G</Text>
        </View>
        
        {/* Button Text */}
        <Text variant="body" style={[styles.buttonText, getTextStyle()]}>
          {loading 
            ? (variant === 'signin' ? 'Signing in...' : 'Creating account...')
            : (variant === 'signin' ? 'Continue with Google' : 'Sign up with Google')
          }
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});