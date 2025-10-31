import { Platform } from 'react-native';
import { Label, RadioGroup, ToggleGroup, XStack, YStack } from 'tamagui';

type RoleSelectorProps = {
  value: 'client' | 'trainer';
  onValueChange: (value: string) => void;
};

export function RoleSelector({ value, onValueChange }: RoleSelectorProps) {
  if (Platform.OS === 'ios') {
    // Segmented Control for iOS
    return (
      <ToggleGroup type="single" value={value} onValueChange={onValueChange} orientation="horizontal" width="100%">
        <ToggleGroup.Item value="client" flex={1}>
          <Label>Client</Label>
        </ToggleGroup.Item>
        <ToggleGroup.Item value="trainer" flex={1}>
          <Label>Trainer</Label>
        </ToggleGroup.Item>
      </ToggleGroup>
    );
  }

  // Radio Buttons for Android
  return (
    <RadioGroup value={value} onValueChange={onValueChange} space="$2">
        <XStack alignItems="center" space="$2">
            <RadioGroup.Item value="client" id="client">
            <RadioGroup.Indicator />
            </RadioGroup.Item>
            <Label htmlFor="client">Client</Label>
        </XStack>
        <XStack alignItems="center" space="$2">
            <RadioGroup.Item value="trainer" id="trainer">
            <RadioGroup.Indicator />
            </RadioGroup.Item>
            <Label htmlFor="trainer">Trainer</Label>
        </XStack>
    </RadioGroup>
  );
}
      