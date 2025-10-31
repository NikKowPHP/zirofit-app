import { Platform, ViewStyle } from 'react-native';
import { Card as TamaguiCard, CardProps } from 'tamagui';

export function Card(props: CardProps) {
  const platformStyle: ViewStyle = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    android: {
      elevation: 2,
    },
  }) as ViewStyle;

  return <TamaguiCard {...props} style={[platformStyle, props.style]} />;
}
      