import { SafeAreaView, StyleSheet } from 'react-native';
import { YStack } from 'tamagui';
import { useTheme } from 'tamagui';

interface ScreenProps {
  children: React.ReactNode;
  center?: boolean;
}

export function Screen({ children, center = false }: ScreenProps) {
  const theme = useTheme();

  const containerStyle = [styles.container, { backgroundColor: theme.background.get() }];

  if (center) {
    return (
      <SafeAreaView style={[...containerStyle, styles.center]}>
        <YStack space="$4" padding="$4" alignItems="center" justifyContent="center" flex={1}>
          {children}
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={containerStyle}>
      <YStack space="$4" padding="$4" flex={1}>
        {children}
      </YStack>
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
