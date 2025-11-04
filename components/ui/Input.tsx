import { Input as TamaguiInput, InputProps, styled } from 'tamagui';

const StyledInput = styled(TamaguiInput, {
  backgroundColor: '$color.surface',
  borderColor: '$color.border',
  borderWidth: 1,
  borderRadius: '$3',
  paddingHorizontal: '$3',
  paddingVertical: '$2',
  fontSize: '$md',
  color: '$color.text',
  placeholderTextColor: '$color.textSecondary',
  focusStyle: {
    borderColor: '$color.primary',
  },
});

export function Input(props: InputProps) {
  return <StyledInput {...props} />;
}
      