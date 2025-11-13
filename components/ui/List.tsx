import { VStack } from './Stack';
import { useTokens } from '@/hooks/useTheme';
import { ReactNode } from 'react';

interface ListProps {
  children: ReactNode;
  space?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export function List({ children, space = 'sm' }: ListProps) {
  const tokens = useTokens();

  return (
    <VStack style={{ gap: tokens.spacing[space] }}>
      {children}
    </VStack>
  );
}
