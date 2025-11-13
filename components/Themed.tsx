/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView } from 'react-native';
import { useTheme, useTokens } from '@/hooks/useTheme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: 'text' | 'background' | 'textSecondary' | 'surface' | 'border' | 'primary' | 'danger'
) {
  const theme = useTheme();
  const colorFromProps = props.light || props.dark; // Simplified, assuming we handle light/dark elsewhere

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return theme[colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function BodyText(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const theme = useTheme();
  const tokens = useTokens();

  return <DefaultText style={[{ color: theme.text, fontSize: tokens.fontSizes.md }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
