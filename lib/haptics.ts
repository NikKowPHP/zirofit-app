import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export const triggerHaptic = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS === 'ios') {
        Haptics.impactAsync(style);
    }
}
      