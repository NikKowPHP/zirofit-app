import { View, Text } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import { YStack, H6 } from 'tamagui';

type InlineRestTimerProps = {
    duration: number;
    onFinish: () => void;
}

export default function InlineRestTimer({ duration, onFinish }: InlineRestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

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
      <YStack alignItems='center' space="$1">
        <H6>REST</H6>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{timeLeft}s</Text>
      </YStack>
    </View>
  );
}
      