import { YStack, H5 } from 'tamagui';
import { ReactNode } from 'react';

interface SectionProps {
  title?: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <YStack space="$3">
      {title && <H5>{title}</H5>}
      {children}
    </YStack>
  );
}
