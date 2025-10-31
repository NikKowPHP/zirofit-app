import { Platform } from 'react-native';
import { Button as TamaguiButton, ButtonProps, styled } from 'tamagui';

const StyledButton = styled(TamaguiButton, {
  // Base styles for the button
  pressStyle: Platform.select({
    ios: {
      opacity: 0.7,
    },
    android: {
      // Tamagui handles ripple effect on Android by default
      // You can customize it if needed, but it's usually automatic
    },
  }),
});

export function Button(props: ButtonProps) {
  return <StyledButton {...props} />;
}
      