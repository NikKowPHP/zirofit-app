import { View, Text } from '@/components/Themed';
import { StyleSheet } from 'react-native';

export default function PhotosTab() {
  return (
    <View style={styles.container}>
      <Text>Photos Tab</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
      