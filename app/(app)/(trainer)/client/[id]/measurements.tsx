import { View, Text } from '@/components/Themed';
import { useClientDetails } from '@/hooks/useClientDetails';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

export default function MeasurementsTab() {
  const { id } = useLocalSearchParams();
  const { data: client, isLoading } = useClientDetails(id as string);

  if (isLoading || !client) {
    return <View style={styles.container}><ActivityIndicator /></View>
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={client.measurements}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
            <View style={styles.item}>
                <Text style={styles.date}>{new Date(item.measured_at).toLocaleDateString()}</Text>
                <Text>{item.measurement_type}: {item.value} {item.unit}</Text>
            </View>
        )}
        ListEmptyComponent={<Text>No measurements logged yet.</Text>}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    item: {
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 10,
        width: '100%',
    },
    date: {
        fontWeight: 'bold',
        marginBottom: 5,
    }
});
      