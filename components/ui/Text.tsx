import { Text as RNText, StyleSheet, TextProps, TextStyle } from 'react-native';
import { useTheme, useTokens } from '@/hooks/useTheme';

interface TextPropsExtended extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body' | 'caption';
}

export function Text({ variant = 'body', style, ...props }: TextPropsExtended) {
  const theme = useTheme();
  const tokens = useTokens();

  const textStyle = getTextStyle(variant, theme, tokens);

  return <RNText {...props} style={[styles.text, textStyle, style]} />;
}

const getTextStyle = (variant: string, theme: any, tokens: any): TextStyle => {
  const baseStyle: TextStyle = {
    color: theme.text,
  };

  switch (variant) {
    case 'h1':
      return {
        ...baseStyle,
        fontSize: tokens.fontSizes['3xl'],
        fontWeight: tokens.fontWeights.bold,
        lineHeight: tokens.lineHeights['3xl'],
      };
    case 'h2':
      return {
        ...baseStyle,
        fontSize: tokens.fontSizes['2xl'],
        fontWeight: tokens.fontWeights.bold,
        lineHeight: tokens.lineHeights['2xl'],
      };
    case 'h3':
      return {
        ...baseStyle,
        fontSize: tokens.fontSizes.xl,
        fontWeight: tokens.fontWeights.semibold,
        lineHeight: tokens.lineHeights.xl,
      };
    case 'h4':
      return {
        ...baseStyle,
        fontSize: tokens.fontSizes.lg,
        fontWeight: tokens.fontWeights.semibold,
        lineHeight: tokens.lineHeights.lg,
      };
    case 'h5':
      return {
        ...baseStyle,
        fontSize: tokens.fontSizes.md,
        fontWeight: tokens.fontWeights.medium,
        lineHeight: tokens.lineHeights.md,
      };
    case 'body':
      return {
        ...baseStyle,
        fontSize: tokens.fontSizes.md,
        fontWeight: tokens.fontWeights.regular,
        lineHeight: tokens.lineHeights.md,
      };
    case 'caption':
      return {
        ...baseStyle,
        fontSize: tokens.fontSizes.sm,
        fontWeight: tokens.fontWeights.regular,
        lineHeight: tokens.lineHeights.sm,
      };
    default:
      return baseStyle;
  }
};

const styles = StyleSheet.create({
  text: {},
});
