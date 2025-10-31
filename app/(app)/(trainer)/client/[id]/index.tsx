import { View, Text } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useClientDetails } from '@/hooks/useClientDetails';

export default function ClientWorkoutsTab() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: client, isLoading } = useClientDetails(id as string);
  
  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator /></View>
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={client.workouts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
            <View style={styles.workoutItem}>
                <Text style={styles.workoutName}>{item.name}</Text>
                <Text>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
        )}
        ListHeaderComponent={
          <Button my="$4" onPress={() => router.push(`/client/${id}/live`)}>
            View Live Workout
          </Button>
        }
        ListEmptyComponent={<Text>No workouts logged yet.</Text>}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    workoutItem: {
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 10,
    },
    workoutName: {
        fontWeight: 'bold',
    }
});
      