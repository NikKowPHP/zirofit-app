import { View, Text } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import { VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { useTokens } from '@/hooks/useTheme';

type InlineRestTimerProps = {
    duration: number;
    onFinish: () => void;
}

export default function InlineRestTimer({ duration, onFinish }: InlineRestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const tokens = useTokens();

  useEffect(() => {
    if (timeLeft <= 0) {
        onFinish();
        return;
    };

    const intervalId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onFinish]);

  return (
    <View style={{ padding: 10, borderRadius: 8, backgroundColor: '#e0e0e0' }}>
      <VStack style={{ alignItems: 'center', gap: tokens.spacing.xs }}>
        <UIText variant="caption">REST</UIText>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{timeLeft}s</Text>
      </VStack>
    </View>
  );
}
      