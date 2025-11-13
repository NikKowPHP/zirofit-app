import { SafeAreaView, StyleSheet } from 'react-native';
import { VStack } from './Stack';
import { useTheme, useTokens } from '@/hooks/useTheme';

interface ScreenProps {
  children: React.ReactNode;
  center?: boolean;
}

export function Screen({ children, center = false }: ScreenProps) {
  const theme = useTheme();
  const tokens = useTokens();

  const containerStyle = [styles.container, { backgroundColor: theme.background }];

  if (center) {
    return (
      <SafeAreaView style={[...containerStyle, styles.center]}>
        <VStack style={{ padding: tokens.spacing.lg, gap: tokens.spacing.lg, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          {children}
        </VStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={containerStyle}>
      <VStack style={{ padding: tokens.spacing.lg, gap: tokens.spacing.lg, flex: 1 }}>
        {children}
      </VStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
