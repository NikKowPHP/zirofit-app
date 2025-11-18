import { ReactNode } from 'react';
import { Platform, TouchableOpacity, StyleSheet, Text, TouchableOpacityProps, TextStyle, ViewStyle } from 'react-native';
import { useTheme, useTokens } from '@/hooks/useTheme';
import { triggerHaptic } from '@/lib/haptics';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  children: ReactNode;
}

export function Button({ variant = 'primary', children, style, ...props }: ButtonProps) {
  const theme = useTheme();
  const tokens = useTokens();

  const buttonStyle = getButtonStyle(variant, theme, tokens);
  const textStyle = getTextStyle(variant, theme, tokens);

  const handlePress = (e: any) => {
    triggerHaptic();
    if (props.onPress) {
      props.onPress(e);
    }
  };

  return (
    <TouchableOpacity {...props} style={[styles.button, buttonStyle, style]} onPress={handlePress}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

const getButtonStyle = (variant: string, theme: any, tokens: any): ViewStyle => {
  const baseStyle: ViewStyle = {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radii.sm,
    minHeight: 44, // Accessibility
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: theme.primary,
        borderWidth: 0,
      };
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: theme.secondary,
        borderWidth: 0,
      };
    case 'outline':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderColor: theme.primary,
        borderWidth: 1,
      };
    case 'danger':
      return {
        ...baseStyle,
        backgroundColor: theme.danger,
        borderWidth: 0,
      };
    case 'ghost':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 0,
      };
    default:
      return baseStyle;
  }
};

const getTextStyle = (variant: string, theme: any, tokens: any): TextStyle => {
  const baseStyle: TextStyle = {
    fontSize: tokens.fontSizes.md,
    fontWeight: tokens.fontWeights.medium as any,
    textAlign: 'center',
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        color: theme.primaryForeground,
      };
    case 'secondary':
      return {
        ...baseStyle,
        color: theme.secondaryForeground,
      };
    case 'outline':
      return {
        ...baseStyle,
        color: theme.primary,
      };
    case 'danger':
      return {
        ...baseStyle,
        color: theme.background,
      };
    case 'ghost':
      return {
        ...baseStyle,
        color: theme.text,
      };
    default:
      return baseStyle;
  }
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {},
});