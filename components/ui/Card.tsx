import { Card as TamaguiCard, CardProps } from 'tamagui';

export function Card(props: CardProps) {
  return <TamaguiCard {...props} elevate size="$4" backgroundColor="$color.surface" borderColor="$color.border" borderWidth={1} borderRadius="$md" />;
}
      