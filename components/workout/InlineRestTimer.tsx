import { View, Text } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import { YStack, H6 } from 'tamagui';

export default function InlineRestTimer({ duration }: { duration: number }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <View style={{ padding: 10, borderRadius: 8, backgroundColor: '#e0e0e0' }}>
      <YStack alignItems='center' space="$1">
        <H6>REST</H6>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{timeLeft}s</Text>
      </YStack>
    </View>
  );
}
      