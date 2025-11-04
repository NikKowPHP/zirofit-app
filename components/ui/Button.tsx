import { Platform } from 'react-native';
import { Button as TamaguiButton, ButtonProps as TamaguiButtonProps, styled } from 'tamagui';
import { triggerHaptic } from '@/lib/haptics';

const StyledButton = styled(TamaguiButton, {
  // Base styles
  paddingHorizontal: '$4',
  paddingVertical: '$2',
  borderRadius: '$3',
  fontSize: '$md',
  fontWeight: '$medium',
  minHeight: 44, // Accessibility
  pressStyle: Platform.select({
    ios: {
      opacity: 0.7,
    },
    android: {
      // Tamagui handles ripple effect
    },
  }),
  variants: {
    variant: {
      primary: {
        backgroundColor: '$color.primary',
        color: '$color.primaryForeground',
        borderColor: '$color.primary',
        borderWidth: 0,
        hoverStyle: {
          backgroundColor: '$color.primary',
          opacity: 0.9,
        },
      },
      secondary: {
        backgroundColor: '$color.secondary',
        color: '$color.secondaryForeground',
        borderColor: '$color.secondary',
        borderWidth: 0,
        hoverStyle: {
          backgroundColor: '$color.secondary',
          opacity: 0.9,
        },
      },
      outline: {
        backgroundColor: 'transparent',
        color: '$color.primary',
        borderColor: '$color.primary',
        borderWidth: 1,
        hoverStyle: {
          backgroundColor: '$color.surfaceHover',
        },
      },
      danger: {
        backgroundColor: '$color.danger',
        color: '$color.background',
        borderColor: '$color.danger',
        borderWidth: 0,
        hoverStyle: {
          backgroundColor: '$color.danger',
          opacity: 0.9,
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '$color.text',
        borderColor: 'transparent',
        borderWidth: 0,
        hoverStyle: {
          backgroundColor: '$color.surfaceHover',
        },
      },
    },
  } as const,
  defaultVariants: {
    variant: 'primary',
  },
});

interface ButtonProps extends Omit<TamaguiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
}

export function Button({ variant, ...props }: ButtonProps) {
  const handlePress = (e: any) => {
    triggerHaptic();
    if (props.onPress) {
      props.onPress(e);
    }
  };

  return <StyledButton {...props} variant={variant} onPress={handlePress} />;
}