import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme, useTokens } from '@/hooks/useTheme';

export function Input(props: TextInputProps) {
  const theme = useTheme();
  const tokens = useTokens();

  const inputStyle = {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: tokens.radii.sm,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    fontSize: tokens.fontSizes.md,
    color: theme.text,
  };

  return (
    <TextInput
      {...props}
      style={[styles.input, inputStyle, props.style]}
      placeholderTextColor={theme.textSecondary}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
  },
});
      