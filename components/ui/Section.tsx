import { VStack } from './Stack';
import { Text } from './Text';
import { useTokens } from '@/hooks/useTheme';
import { ReactNode } from 'react';

interface SectionProps {
  title?: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  const tokens = useTokens();

  return (
    <VStack style={{ gap: tokens.spacing.md }}>
      {title && <Text variant="h5">{title}</Text>}
      {children}
    </VStack>
  );
}
