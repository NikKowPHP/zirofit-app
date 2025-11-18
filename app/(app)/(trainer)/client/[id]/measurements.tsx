import { View, Text } from '@/components/Themed';
import { useClientDetails } from '@/hooks/useClientDetails';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { withObservables } from '@nozbe/watermelondb/react';
import { clientMeasurementRepository } from '@/lib/repositories';
import ClientMeasurement from '@/lib/db/models/ClientMeasurement';

interface MeasurementsTabProps {
  measurements: ClientMeasurement[];
}

function MeasurementsTab({ measurements }: MeasurementsTabProps) {
  const { id } = useLocalSearchParams();
  const { data: client, isLoading: clientLoading } = useClientDetails(id as string);

  const isLoading = clientLoading;

  if (isLoading || !client) {
    return <View style={styles.container}><ActivityIndicator /></View>
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={measurements}
        keyExtractor={item => item.id}
        renderItem={({ item }: { item: ClientMeasurement }) => (
            <View style={styles.item}>
                <Text style={styles.date}>{new Date(item.measuredAt).toLocaleDateString()}</Text>
                <Text>{item.measurementType}: {item.value} {item.unit}</Text>
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

const enhance = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const { id } = useLocalSearchParams();
    const clientId = Array.isArray(id) ? id[0] : id;

    // Only create observables if we have a valid clientId
    const observables = clientId ? {
      measurements: clientMeasurementRepository.observeMeasurementsByClient(clientId),
    } : {
      measurements: [],
    };

    const EnhancedComponent = withObservables([], () => observables)(WrappedComponent);

    return <EnhancedComponent {...props} />;
  };
};

export default enhance(MeasurementsTab);