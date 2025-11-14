import { View, Text } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Alert } from 'react-native';
import { Button } from '@/components/ui/Button';
import { withObservables } from '@nozbe/watermelondb/react';
import { clientRepository, workoutTemplateRepository, workoutSessionRepository } from '@/lib/repositories';
import Client from '@/lib/db/models/Client';
import WorkoutTemplate from '@/lib/db/models/WorkoutTemplate';
import WorkoutSession from '@/lib/db/models/WorkoutSession';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import React from 'react';

interface ClientDetailScreenProps {
  client: Client[];
  templates: WorkoutTemplate[];
  workoutSessions: WorkoutSession[];
}

function ClientDetailScreen({ client, templates, workoutSessions }: ClientDetailScreenProps) {
  const params = useLocalSearchParams();
  const rawClientId = params.id;
  const clientId = Array.isArray(rawClientId) ? rawClientId[0] : rawClientId;
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  console.log('=== CLIENT WORKOUTS TAB DEBUG ===');
  console.log('Client ID from params:', clientId);
  console.log('Client ID type:', typeof clientId);

  const clientData = client.length > 0 ? client[0] : null;

  const handleStartWorkout = async (templateId?: string) => {
    if (!clientId) return;

    try {
      await workoutSessionRepository.createWorkoutSession({
        userId: clientId,
        templateId: templateId,
        status: 'active',
        startedAt: Date.now(),
        name: templateId ? `Workout from template` : 'Free workout',
      });

      Alert.alert('Success', 'Workout session started for client.');
      setModalVisible(false);
      router.push({
        pathname: '/(app)/(trainer)/client/[id]/live',
        params: { id: clientId },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to start workout.');
    }
  };

  const handleViewLiveWorkout = () => {
    if (!clientId) return;

    console.log('=== NAVIGATING TO LIVE WORKOUT ===');
    console.log('Client ID:', clientId);
    router.push({
      pathname: '/(app)/(trainer)/client/[id]/live',
      params: { id: clientId },
    });
  };

  if (!clientData) {
    return <View style={styles.center}><ActivityIndicator /></View>
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={workoutSessions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
            <View style={styles.workoutItem}>
                <Text style={styles.workoutName}>{item.name || 'Unnamed workout'}</Text>
                <Text>{new Date(item.startedAt).toLocaleDateString()}</Text>
            </View>
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Button onPress={() => setModalVisible(true)} style={{ marginBottom: 10 }}>
              Start New Workout
            </Button>
            <Button onPress={handleViewLiveWorkout} style={{ marginTop: 10 }}>
              View Live Workout
            </Button>
          </View>
        }
        ListEmptyComponent={<Text>No workouts found.</Text>}
        contentContainerStyle={{ padding: 10 }}
      />

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)} title="Select Workout Template">
        <View>
          <Button
            onPress={() => handleStartWorkout()}
            style={{ marginBottom: 16 }}
          >
            Start Free Workout
          </Button>
          <Text style={{textAlign: 'center', marginBottom: 8}}>Or select a template</Text>
          {templates.map(item => (
            <Button
              key={item.id}
              onPress={() => handleStartWorkout(item.id)}
              style={{ marginBottom: 10 }}
            >
              {item.name}
            </Button>
          ))}
          {templates.length === 0 && (
            <Text>No templates available.</Text>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 10 },
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

// Wrap component with withObservables for reactive data
const enhance = (WrappedComponent: React.ComponentType<any>) => {
    return (props: any) => {
        const params = useLocalSearchParams();
        const rawClientId = params.id;
        const clientId = Array.isArray(rawClientId) ? rawClientId[0] : rawClientId;

        const EnhancedComponent = withObservables([], () => ({
            client: clientRepository.observeClient(clientId || ''),
            templates: workoutTemplateRepository.observeWorkoutTemplates(),
            workoutSessions: workoutSessionRepository.observeWorkoutSessionsForClient(clientId || ''),
        }))(WrappedComponent);

        return <EnhancedComponent {...props} clientId={clientId} />;
    };
};

export default enhance(ClientDetailScreen);