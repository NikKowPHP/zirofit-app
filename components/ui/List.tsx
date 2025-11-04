import { YStack } from 'tamagui';
import { ReactNode } from 'react';

interface ListProps {
  children: ReactNode;
  space?: string;
}

export function List({ children, space = '$2' }: ListProps) {
  return (
    <YStack space={space}>
      {children}
    </YStack>
  );
}
