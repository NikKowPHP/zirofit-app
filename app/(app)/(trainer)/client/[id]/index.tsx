import { View, Text } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Alert } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useClientDetails } from '@/hooks/useClientDetails';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { startWorkoutSession, getWorkoutTemplates } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { useState } from 'react';

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

export default function ClientWorkoutsTab() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: client, isLoading } = useClientDetails(id as string);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  console.log('=== CLIENT WORKOUTS TAB DEBUG ===');
  console.log('Client ID from params:', id);
  console.log('Client ID type:', typeof id);
  console.log('Client data:', client);

  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['workoutTemplates'],
    queryFn: getWorkoutTemplates,
  });

  const startWorkoutMutation = useMutation({
    mutationFn: (templateId: string | undefined) => startWorkoutSession({ templateId, clientId: id as string }),
    onSuccess: () => {
      Alert.alert('Success', 'Workout session started for client.');
      setModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ['activeClientSession', id] });
      queryClient.invalidateQueries({ queryKey: ['client', id] });
      router.push(`/client/${id}/live`);
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to start workout.');
    },
  });

  if (isLoading || !client) {
    return <View style={styles.center}><ActivityIndicator /></View>
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={client?.workoutSessions || client?.workouts || []}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
            <View style={styles.workoutItem}>
                <Text style={styles.workoutName}>{item.name}</Text>
                <Text>{new Date(item.started_at).toLocaleDateString()}</Text>
            </View>
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Button onPress={() => setModalVisible(true)} style={{ marginBottom: 10 }}>
              Start New Workout
            </Button>
            <Button onPress={() => {
              console.log('=== NAVIGATING TO LIVE WORKOUT ===');
              console.log('Client ID:', id);
              router.push({
                pathname: '/(app)/(trainer)/client/[id]/live',
                params: { id: id as string },
              });
            }} style={{ marginTop: 10 }}>
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
            onPress={() => {
              startWorkoutMutation.mutate(undefined);
            }}
            disabled={startWorkoutMutation.isPending}
            style={{ marginBottom: 16 }}
          >
            Start Free Workout
          </Button>
          <Text style={{textAlign: 'center', marginBottom: 8}}>Or select a template</Text>
          {templatesLoading ? (
            <Text>Loading templates...</Text>
          ) : (
            <>
              {(templates || []).map(item => (
                <Button
                  key={item.id}
                  onPress={() => {
                    setSelectedTemplate(item.id);
                    startWorkoutMutation.mutate(item.id);
                  }}
                  disabled={startWorkoutMutation.isPending}
                  style={{ marginBottom: 10 }}
                >
                  {item.name}
                </Button>
              ))}
              {((templates || []).length === 0) && (
                <Text>No templates available.</Text>
              )}
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}
      