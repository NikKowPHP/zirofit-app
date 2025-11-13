import { View, StyleSheet, ViewProps } from 'react-native';
import { useTheme, useTokens } from '@/hooks/useTheme';

export function Card(props: ViewProps) {
  const theme = useTheme();
  const tokens = useTokens();

  const cardStyle = {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: tokens.radii.md,
    padding: tokens.spacing.md,
  };

  return <View {...props} style={[styles.card, cardStyle, props.style]} />;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    // Add shadow styles for iOS/Android here if needed
  },
});
      