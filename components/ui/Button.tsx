import { Platform } from 'react-native';
import { Button as TamaguiButton, ButtonProps, styled } from 'tamagui';
import { triggerHaptic } from '@/lib/haptics';

const StyledButton = styled(TamaguiButton, {
  // Base styles for the button
  pressStyle: Platform.select({
    ios: {
      opacity: 0.7,
    },
    android: {
      // Tamagui handles ripple effect on Android by default
    },
  }),
});

export function Button(props: ButtonProps) {
  const handlePress = (e: any) => {
    triggerHaptic();
    if (props.onPress) {
      props.onPress(e);
    }
  };

  return <StyledButton {...props} onPress={handlePress} />;
}
      