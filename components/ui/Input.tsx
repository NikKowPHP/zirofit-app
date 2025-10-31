import { Platform, ViewStyle } from 'react-native';
import { Input as TamaguiInput, InputProps } from 'tamagui';

export function Input(props: InputProps) {
  // This is a simplified example. In a real app, these styles would
  // likely come from your Tamagui theme.
  const platformStyle: InputProps = Platform.select({
    ios: {
      backgroundColor: '#f0f0f0',
      borderColor: '#d0d0d0',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      height: 40,
    },
    android: {
      // A simplified "filled" Material Design style
      backgroundColor: '#f6f6f6',
      borderBottomColor: '#757575',
      borderBottomWidth: 1,
      paddingHorizontal: 10,
      height: 50, // Material inputs are often taller
    },
  }) as InputProps;

  return <TamaguiInput {...props} {...platformStyle} />;
}
      