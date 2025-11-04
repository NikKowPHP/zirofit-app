import { createFont, createTamagui } from 'tamagui'
import { config } from '@tamagui/config/v3'

const lightColorRoles = {
  primary: '#007AFF',
  primaryForeground: '#FFFFFF',
  secondary: '#6B7280',
  secondaryForeground: '#FFFFFF',
  surface: '#F9FAFB',
  surfaceHover: '#F3F4F6',
  surfaceElevated: '#FFFFFF',
  border: '#D1D5DB',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  text: '#111827',
  textSecondary: '#4B5563',
  background: '#FFFFFF',
}

const darkColorRoles = {
  primary: '#0A84FF',
  primaryForeground: '#FFFFFF',
  secondary: '#9CA3AF',
  secondaryForeground: '#FFFFFF',
  surface: '#1F2937',
  surfaceHover: '#374151',
  surfaceElevated: '#111827',
  border: '#4B5563',
  success: '#34D399',
  danger: '#F87171',
  warning: '#FBBF24',
  info: '#60A5FA',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  background: '#0B1120',
}

const spacingScale = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
}

const radiusScale = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
}

const fontSizeScale = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
}

const lineHeightScale = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
}

const fontWeightScale = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
}

const letterSpacingScale = {
  xs: 0,
  sm: 0,
  md: 0,
  lg: 0.15,
  xl: 0.25,
  '2xl': 0.35,
  '3xl': 0.45,
}

const bodyFont = createFont({
  family: 'System',
  size: fontSizeScale,
  lineHeight: lineHeightScale,
  weight: fontWeightScale,
  letterSpacing: letterSpacingScale,
})

const headingFont = createFont({
  family: 'System',
  size: {
    xs: 20,
    sm: 24,
    md: 28,
    lg: 32,
    xl: 40,
    '2xl': 48,
    '3xl': 56,
  },
  lineHeight: {
    xs: 28,
    sm: 32,
    md: 36,
    lg: 40,
    xl: 48,
    '2xl': 56,
    '3xl': 64,
  },
  weight: {
    regular: '500',
    medium: '600',
    semibold: '700',
    bold: '800',
  },
  letterSpacing: {
    xs: -0.1,
    sm: -0.15,
    md: -0.2,
    lg: -0.25,
    xl: -0.3,
    '2xl': -0.35,
    '3xl': -0.4,
  },
})

const tokens = {
  ...config.tokens,
  color: {
    ...config.tokens.color,
    primary: lightColorRoles.primary,
    primaryForeground: lightColorRoles.primaryForeground,
    secondary: lightColorRoles.secondary,
    secondaryForeground: lightColorRoles.secondaryForeground,
    surface: lightColorRoles.surface,
    surfaceHover: lightColorRoles.surfaceHover,
    surfaceElevated: lightColorRoles.surfaceElevated,
    border: lightColorRoles.border,
    success: lightColorRoles.success,
    danger: lightColorRoles.danger,
    warning: lightColorRoles.warning,
    info: lightColorRoles.info,
    text: lightColorRoles.text,
    textSecondary: lightColorRoles.textSecondary,
    background: lightColorRoles.background,
  },
  space: {
    ...config.tokens.space,
    ...spacingScale,
  },
  radius: {
    ...config.tokens.radius,
    ...radiusScale,
  },
  size: {
    ...config.tokens.size,
    ...fontSizeScale,
  },
}

const lightTheme = {
  ...config.themes.light,
  ...lightColorRoles,
}

const darkTheme = {
  ...config.themes.dark,
  ...darkColorRoles,
}

const themes = {
  ...config.themes,
  light: lightTheme,
  dark: darkTheme,
}

const fonts = {
  ...config.fonts,
  body: bodyFont,
  heading: headingFont,
}

const appConfig = createTamagui({
  ...config,
  tokens,
  themes,
  fonts,
})

export type AppConfig = typeof appConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig
      