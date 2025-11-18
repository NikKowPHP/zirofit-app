import { View, Text } from '@/components/Themed';
import { useClientDetails } from '@/hooks/useClientDetails';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { withObservables } from '@nozbe/watermelondb/react';
import { clientMeasurementRepository } from '@/lib/repositories';
import ClientMeasurement from '@/lib/db/models/ClientMeasurement';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { VStack } from '@/components/ui/Stack';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';
// Using a simple dropdown alternative since @react-native-picker/picker might not be installed

interface MeasurementsTabProps {
  measurements: ClientMeasurement[];
}

function MeasurementsTab({ measurements }: MeasurementsTabProps) {
  const { id } = useLocalSearchParams();
  const clientId = Array.isArray(id) ? id[0] : id;
  const { data: client, isLoading: clientLoading } = useClientDetails(clientId as string);
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [measurementType, setMeasurementType] = useState('weight');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('kg');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = clientLoading;

  const handleAddMeasurement = async () => {
    if (!value || !clientId) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      Alert.alert('Error', 'Please enter a valid number for the value.');
      return;
    }

    setIsSubmitting(true);
    try {
      await clientMeasurementRepository.createClientMeasurement({
        clientId: clientId as string,
        measurementType,
        value: numValue,
        unit,
        measuredAt: Date.now(),
        notes: notes || undefined,
      });

      Alert.alert('Success', 'Measurement added successfully.');
      setModalVisible(false);
      setValue('');
      setNotes('');
      setUnit('kg');
      setMeasurementType('weight');
    } catch (error) {
      console.error('Error adding measurement:', error);
      Alert.alert('Error', 'Failed to add measurement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !client) {
    return <View style={styles.container}><ActivityIndicator /></View>
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={measurements || []}
        keyExtractor={item => item.id}
        renderItem={({ item }: { item: ClientMeasurement }) => (
            <View style={[styles.item, { backgroundColor: theme.surface }]}>
                <Text style={styles.date}>{new Date(item.measuredAt).toLocaleDateString()}</Text>
                <Text style={styles.measurementText}>
                  {item.measurementType}: {item.value} {item.unit}
                </Text>
                {item.notes && (
                  <Text style={[styles.notes, { color: theme.textSecondary }]}>{item.notes}</Text>
                )}
            </View>
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Button onPress={() => setModalVisible(true)}>
              Add Measurement
            </Button>
          </View>
        }
        ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.textSecondary }]}>No measurements logged yet.</Text>}
        contentContainerStyle={{ padding: 10 }}
      />

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Add Measurement"
      >
        <ScrollView>
          <VStack style={styles.form}>
            <Text style={[styles.label, { color: theme.text }]}>Measurement Type</Text>
            <View style={styles.typeButtons}>
              {['weight', 'body_fat', 'chest', 'waist', 'hips', 'arms', 'thighs', 'neck', 'other'].map((type) => (
                <Button
                  key={type}
                  onPress={() => setMeasurementType(type)}
                  variant={measurementType === type ? 'primary' : 'outline'}
                  style={styles.typeButton}
                >
                  {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Button>
              ))}
            </View>

            <Text style={[styles.label, { color: theme.text }]}>Value *</Text>
            <Input
              value={value}
              onChangeText={setValue}
              placeholder="Enter value"
              keyboardType="decimal-pad"
            />

            <Text style={[styles.label, { color: theme.text }]}>Unit</Text>
            <Input
              value={unit}
              onChangeText={setUnit}
              placeholder="kg, lbs, cm, inches, etc."
            />

            <Text style={[styles.label, { color: theme.text }]}>Notes</Text>
            <Input
              value={notes}
              onChangeText={setNotes}
              placeholder="Optional notes"
              multiline
              numberOfLines={3}
            />

            <View style={styles.buttonRow}>
              <Button
                onPress={() => setModalVisible(false)}
                variant="outline"
                style={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                onPress={handleAddMeasurement}
                disabled={isSubmitting || !value}
                style={styles.submitButton}
              >
                {isSubmitting ? 'Adding...' : 'Add Measurement'}
              </Button>
            </View>
          </VStack>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 10,
    paddingBottom: 15,
  },
  item: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  date: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 14,
  },
  measurementText: {
    fontSize: 16,
    marginBottom: 4,
  },
  notes: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  typeButton: {
    flex: 1,
    minWidth: '30%',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
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