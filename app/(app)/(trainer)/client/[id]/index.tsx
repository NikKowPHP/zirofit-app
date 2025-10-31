import { View, Text } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Button } from '@/components/ui/Button';

export default function ClientWorkoutsTab() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Text>Workouts for Client {id}</Text>
      <Button mt="$4" onPress={() => router.push(`/client/${id}/live`)}>
        View Live Workout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
      