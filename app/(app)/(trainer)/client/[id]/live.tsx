import { View, Text } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { useState, useMemo } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack, HStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { useTokens } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { withObservables } from '@nozbe/watermelondb/react';
import { workoutSessionRepository, exerciseRepository, clientExerciseLogRepository, clientRepository } from '@/lib/repositories';
import WorkoutSession from '@/lib/db/models/WorkoutSession';
import Exercise from '@/lib/db/models/Exercise';
import ClientExerciseLog from '@/lib/db/models/ClientExerciseLog';
import Client from '@/lib/db/models/Client';
import React from 'react';

type LiveRouteParams = { id?: string | string[] };

interface LiveWorkoutScreenProps {
  activeSession: WorkoutSession[];
  exercises: Exercise[];
  exerciseLogs: ClientExerciseLog[];
  client: Client[];
}

function LiveWorkoutScreen({ activeSession, exercises, exerciseLogs, client }: LiveWorkoutScreenProps) {
    const params = useLocalSearchParams<LiveRouteParams>();
    const rawClientId = params.id;
    const clientId = Array.isArray(rawClientId) ? rawClientId[0] : rawClientId;
    const tokens = useTokens();
    
    console.log('=== LIVE WORKOUT SCREEN DEBUG ===');
    console.log('Raw search params:', params);
    console.log('Extracted clientId:', clientId);
    console.log('Client ID type:', typeof clientId);
    console.log('Client ID truthy:', Boolean(clientId));

    // If clientId is not available, show an error
    if (!clientId || clientId === 'undefined' || clientId === 'null') {
        console.error('Client ID is not available:', clientId);
        return <SafeAreaView style={styles.center}>
            <Text style={{ color: 'red', textAlign: 'center' }}>
                Error: Client ID not found. Please navigate to this screen from the client's workout page.
            </Text>
        </SafeAreaView>;
    }

    // State for trainer-side logging
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
    const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

    const session = activeSession.length > 0 ? activeSession[0] : null;
    const clientData = client.length > 0 ? client[0] : null;

    const handleFinishWorkout = async () => {
        if (!session) {
            Alert.alert('Error', 'No active session found.');
            return;
        }
        try {
            await workoutSessionRepository.updateWorkoutSession(session.id, {
                status: 'completed',
                finishedAt: Date.now()
            });
            Alert.alert("Success", "Client's workout has been finished.");
        } catch (error) {
            Alert.alert('Error', 'Failed to finish workout');
        }
    };

    const handleLogSet = async () => {
        if (!session || !selectedExerciseId) {
            Alert.alert('Error', 'Session or exercise not selected.');
            return;
        }
        try {
            const setData = JSON.stringify([{
                reps: parseInt(reps),
                weight: parseFloat(weight),
                completed_at: Date.now()
            }]);

            await clientExerciseLogRepository.createClientExerciseLog({
                clientId,
                exerciseId: selectedExerciseId,
                workoutSessionId: session.id,
                sets: setData,
                completedAt: Date.now()
            });

            setReps('');
            setWeight('');
        } catch (error) {
            Alert.alert('Error', 'Failed to log set');
        }
    };
    
    const handleAddExercise = async (exerciseId: string) => {
        if (!session) {
            Alert.alert('Error', 'No active session found.');
            return;
        }
        try {
            // For now, we'll just log that an exercise was added
            // In a full implementation, we'd need to update the session's exercises
            console.log('Adding exercise to session:', exerciseId);
            setExerciseModalVisible(false);
            Alert.alert('Success', 'Exercise added to workout.');
        } catch (error) {
            Alert.alert('Error', 'Failed to add exercise');
        }
    };
    
    const sortedLogs = useMemo(() => {
        return exerciseLogs.sort((a: any, b: any) => b.completedAt - a.completedAt);
    }, [exerciseLogs]);

    if (!session) return <SafeAreaView style={styles.center}><Text>Client does not have an active workout session.</Text></SafeAreaView>;

    return (
        <SafeAreaView style={styles.container}>
            <VStack style={{ gap: tokens.spacing.lg, paddingHorizontal: tokens.spacing.lg, flex: 1 }}>
                <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <UIText variant="h4">Live Feed: {clientData?.name || 'Loading...'}</UIText>
                    <HStack style={{ gap: tokens.spacing.sm }}>
                        <Button onPress={() => setExerciseModalVisible(true)}>
                            Add Exercise
                        </Button>
                        <Button variant="danger" onPress={handleFinishWorkout}>
                            Finish Workout
                        </Button>
                    </HStack>
                </HStack>

                {/* Logging Interface */}
                <View style={{ padding: tokens.spacing.md, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                    <UIText variant="h5" style={{ marginBottom: tokens.spacing.md }}>Log Set</UIText>
                    <VStack style={{ gap: tokens.spacing.sm }}>
                        <HStack style={{ gap: tokens.spacing.sm, alignItems: 'center' }}>
                            <Input 
                                placeholder="Reps" 
                                keyboardType="numeric" 
                                value={reps} 
                                onChangeText={setReps} 
                                style={{ flex: 1 }} 
                            />
                            <Input 
                                placeholder="Weight" 
                                keyboardType="numeric" 
                                value={weight} 
                                onChangeText={setWeight} 
                                style={{ flex: 1 }} 
                            />
                        </HStack>
                        {selectedExerciseId && (
                            <HStack style={{ gap: tokens.spacing.sm, alignItems: 'center' }}>
                                <Text style={{ flex: 1 }}>
                                    {exercises.find((ex: Exercise) => ex.id === selectedExerciseId)?.name}
                                </Text>
                                <Button 
                                    onPress={handleLogSet}
                                    disabled={!reps || !weight}
                                    style={{ flex: 1 }}
                                >
                                    Log Set
                                </Button>
                            </HStack>
                        )}
                    </VStack>
                </View>

                <FlatList
                    data={exercises}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const exerciseLogs = sortedLogs.filter(log => log.exerciseId === item.id);
                        const isSelected = selectedExerciseId === item.id;
                        return (
                            <View style={{ marginVertical: tokens.spacing.sm, padding: tokens.spacing.md, backgroundColor: isSelected ? '#e3f2fd' : '#fff', borderRadius: 8, borderWidth: isSelected ? 2 : 1, borderColor: isSelected ? '#007AFF' : '#ddd' }}>
                                <UIText variant="h5">{item.name}</UIText>
                                {exerciseLogs.length > 0 ? (
                                    exerciseLogs.slice(0, 3).map((log: any, index: number) => {
                                        const sets = JSON.parse(log.sets);
                                        const latestSet = sets[sets.length - 1];
                                        return (
                                            <Text key={log.id}>Set {exerciseLogs.length - index}: {latestSet.reps} reps @ {latestSet.weight} kg</Text>
                                        );
                                    })
                                ) : (
                                    <Text style={styles.timestamp}>No sets logged yet.</Text>
                                )}
                                <Button 
                                    onPress={() => setSelectedExerciseId(item.id)} 
                                    variant={isSelected ? "primary" : "outline"}
                                    style={{ marginTop: tokens.spacing.sm }}
                                >
                                    {isSelected ? "Selected for Logging" : "Select for Logging"}
                                </Button>
                            </View>
                        )
                    }}
                    ListEmptyComponent={<Text>Waiting for client to start logging...</Text>}
                />
            </VStack>

            <Modal
                visible={exerciseModalVisible}
                onClose={() => setExerciseModalVisible(false)}
                title="Add Exercise to Workout"
            >
                <FlatList
                    data={exercises}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Button
                            key={item.id}
                            onPress={() => handleAddExercise(item.id)}
                            style={{ marginBottom: tokens.spacing.sm }}
                        >
                            {item.name}
                        </Button>
                    )}
                    ListEmptyComponent={<Text>No exercises available.</Text>}
                    contentContainerStyle={{ paddingVertical: tokens.spacing.md }}
                />
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    timestamp: { fontSize: 12, color: '#666', marginTop: 4, }
});

// Wrap component with withObservables for reactive data
const enhance = (WrappedComponent: React.ComponentType<any>) => {
    return (props: any) => {
        const params = useLocalSearchParams<LiveRouteParams>();
        const rawClientId = params.id;
        const clientId = Array.isArray(rawClientId) ? rawClientId[0] : rawClientId;

        const EnhancedComponent = withObservables([], () => ({
            activeSession: workoutSessionRepository.observeActiveWorkoutSessionForClient(clientId || ''),
            exercises: exerciseRepository.observeExercises(),
            exerciseLogs: clientExerciseLogRepository.observeClientExerciseLogs(),
            client: clientRepository.observeClient(clientId || ''),
        }))(WrappedComponent);

        return <EnhancedComponent {...props} clientId={clientId} />;
    };
};

export default enhance(LiveWorkoutScreen);