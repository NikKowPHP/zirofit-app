import { Platform, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { HStack, VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';

type RoleSelectorProps = {
  value: 'client' | 'trainer';
  onValueChange: (value: string) => void;
};

export function RoleSelector({ value, onValueChange }: RoleSelectorProps) {
  const theme = useTheme();

  if (Platform.OS === 'ios') {
    // Segmented Control for iOS
    return (
      <HStack style={{ width: '100%', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: theme.border }}>
        <TouchableOpacity
          style={[styles.segment, value === 'client' ? { backgroundColor: theme.primary } : { backgroundColor: theme.background }]}
          onPress={() => onValueChange('client')}
        >
          <UIText variant="body" style={{ color: value === 'client' ? theme.primaryForeground : theme.text }}>Client</UIText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segment, value === 'trainer' ? { backgroundColor: theme.primary } : { backgroundColor: theme.background }]}
          onPress={() => onValueChange('trainer')}
        >
          <UIText variant="body" style={{ color: value === 'trainer' ? theme.primaryForeground : theme.text }}>Trainer</UIText>
        </TouchableOpacity>
      </HStack>
    );
  }

  // Radio Buttons for Android
  return (
    <VStack style={{ gap: 8 }}>
        <TouchableOpacity style={styles.radioRow} onPress={() => onValueChange('client')}>
            <Text style={[styles.radio, { borderColor: theme.border, backgroundColor: value === 'client' ? theme.primary : theme.background }]} />
            <UIText variant="body">Client</UIText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.radioRow} onPress={() => onValueChange('trainer')}>
            <Text style={[styles.radio, { borderColor: theme.border, backgroundColor: value === 'trainer' ? theme.primary : theme.background }]} />
            <UIText variant="body">Trainer</UIText>
        </TouchableOpacity>
    </VStack>
  );
}

const styles = StyleSheet.create({
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
});
      