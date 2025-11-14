import { View, Text } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { useState, useMemo } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack, HStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { useTokens } from '@/hooks/useTheme';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getActiveClientWorkoutSession, logSet, finishWorkoutSession, getAvailableExercises, addExerciseToLiveSession } from '@/lib/api';
import { useClientDetails } from '@/hooks/useClientDetails';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import type { WorkoutSession, ClientExerciseLog } from '@/lib/api.types';

type WorkoutExercise = { id: string; name: string; };

export default function LiveWorkoutScreen() {
    const { id: clientId } = useLocalSearchParams();
    const queryClient = useQueryClient();
    const tokens = useTokens();
    
    // State for trainer-side logging
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
    const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

    const { data: session, isLoading, error } = useQuery<WorkoutSession | null>({
        queryKey: ['activeClientSession', clientId],
        queryFn: () => {
            console.log('=== FETCHING ACTIVE CLIENT SESSION ===');
            console.log('Client ID:', clientId);
            return getActiveClientWorkoutSession(clientId as string);
        },
        enabled: !!clientId,
        // Refetch every 5 seconds as a temporary replacement for real-time updates
        refetchInterval: 5000, 
    });

    const { data: client, isLoading: clientLoading, error: clientError } = useClientDetails(clientId as string);

    // Check if clientId is available after all hooks
    if (!clientId) {
        return <SafeAreaView style={styles.center}><Text>Client ID not found.</Text></SafeAreaView>;
    }

    // ARCHITECTURAL NOTE:
    // The previous implementation used a direct Supabase subscription to listen for database changes.
    // This creates a tight coupling between the frontend and the database schema, bypassing the API layer.
    // To align with a proper API-centric architecture, this has been removed.
    // The correct approach is for the API server to expose a WebSocket or SSE endpoint for real-time updates.
    // As a temporary workaround, we are using periodic refetching (`refetchInterval`) via React Query.
    // A future task should be to implement a proper WebSocket connection managed by our API.

    const finishWorkoutMutation = useMutation({
        mutationFn: () => finishWorkoutSession({ sessionId: session!.id }),
        onSuccess: () => {
            Alert.alert("Success", "Client's workout has been finished.");
            queryClient.invalidateQueries({ queryKey: ['activeClientSession', clientId] });
        },
        onError: (e: any) => Alert.alert('Error', e.message),
    });

    const logSetMutation = useMutation({
        mutationFn: (data: { exercise_id: string }) => logSet({ 
            reps: parseInt(reps), 
            weight: parseFloat(weight),
            exercise_id: data.exercise_id,
            workout_session_id: session!.id,
        }),
        onSuccess: () => {
            setReps('');
            setWeight('');
            // Invalidate to refetch the session data immediately after logging
            queryClient.invalidateQueries({ queryKey: ['activeClientSession', clientId] });
        },
        onError: (e: any) => Alert.alert('Error', e.message),
    });
    
    const { data: exercises, isLoading: exercisesLoading } = useQuery({
        queryKey: ['availableExercises'],
        queryFn: getAvailableExercises,
    });

    console.log('=== TRAINER LIVE SCREEN DEBUG ===');
    console.log('Exercises query loading:', exercisesLoading);
    // console.log('Exercises data:', exercises);
    console.log('Exercises count:', exercises?.length || 0);
    console.log('=================================');

    // Log modal rendering when modal is visible
    if (exerciseModalVisible) {
        console.log('=== RENDERING EXERCISE MODAL ===');
        console.log('Modal visible:', exerciseModalVisible);
        console.log('Exercises in modal:', exercises);
    }

    const addExerciseMutation = useMutation({
        mutationFn: (exerciseId: string) => {
            console.log('=== ADD EXERCISE MUTATION STARTED ===');
            console.log('Adding exercise ID:', exerciseId);
            console.log('Session ID:', session!.id);
            return addExerciseToLiveSession(session!.id, { exercise_id: exerciseId });
        },
        onSuccess: (data) => {
            console.log('=== ADD EXERCISE MUTATION SUCCESS ===');
            console.log('Response data:', data);
            Alert.alert('Success', 'Exercise added to workout.');
            setExerciseModalVisible(false);
            console.log('Invalidating query key:', ['activeClientSession', clientId]);
            queryClient.invalidateQueries({ queryKey: ['activeClientSession', clientId] });
        },
        onError: (error: any) => {
            console.log('=== ADD EXERCISE MUTATION ERROR ===');
            console.log('Error:', error);
            Alert.alert('Error', error.message || 'Failed to add exercise.');
        },
    });
    
    const sortedLogs = useMemo(() => {
        return (session?.logs || []).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [session?.logs]);

    if (isLoading) return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>;
    if (error || !session) return <SafeAreaView style={styles.center}><Text>Client does not have an active workout session.</Text></SafeAreaView>;

    return (
        <SafeAreaView style={styles.container}>
            <VStack style={{ gap: tokens.spacing.lg, paddingHorizontal: tokens.spacing.lg, flex: 1 }}>
                <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <UIText variant="h4">Live Feed: {client?.name || (clientError ? 'Client not found' : 'Loading...')}</UIText>
                    <HStack style={{ gap: tokens.spacing.sm }}>
                        <Button onPress={() => {
                            console.log('Add Exercise button pressed');
                            setExerciseModalVisible(true);
                        }}>
                            Add Exercise
                        </Button>
                        <Button variant="danger" onPress={() => finishWorkoutMutation.mutate()} disabled={finishWorkoutMutation.isPending}>
                            Finish Workout
                        </Button>
                    </HStack>
                </HStack>

                {/* Logging Interface */}
                <Card style={{ padding: tokens.spacing.md }}>
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
                                    Selected: {session.exercises?.find(ex => ex.id === selectedExerciseId)?.name}
                                </Text>
                                <Button 
                                    onPress={() => {
                                        if (selectedExerciseId) {
                                            logSetMutation.mutate({ exercise_id: selectedExerciseId });
                                        }
                                    }} 
                                    disabled={logSetMutation.isPending || !reps || !weight}
                                    style={{ flex: 1 }}
                                >
                                    Log Set
                                </Button>
                            </HStack>
                        )}
                    </VStack>
                </Card>

                <FlatList
                    data={session.exercises || []}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const exerciseLogs = sortedLogs.filter(log => log.exercise_id === item.id);
                        const isSelected = selectedExerciseId === item.id;
                        return (
                            <Card style={{ marginVertical: tokens.spacing.sm, borderWidth: isSelected ? 2 : 0, borderColor: isSelected ? '#007AFF' : 'transparent' }}>
                                <UIText variant="h5">{item.name}</UIText>
                                {exerciseLogs.length > 0 ? (
                                    exerciseLogs.map((log, index) => (
                                        <Text key={log.id}>Set {exerciseLogs.length - index}: {log.reps} reps @ {log.weight} kg</Text>
                                    ))
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
                            </Card>
                        )
                    }}
                    ListEmptyComponent={<Text>Waiting for client to start logging...</Text>}
                />
            </VStack>

            <Modal
                visible={exerciseModalVisible}
                onClose={() => {
                    console.log('Exercise modal closed');
                    setExerciseModalVisible(false);
                }}
                title="Add Exercise to Workout"
            >
                <FlatList
                    data={exercises}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Button
                            key={item.id}
                            onPress={() => {
                                console.log('Exercise selected:', item.name, item.id);
                                addExerciseMutation.mutate(item.id);
                            }}
                            disabled={addExerciseMutation.isPending}
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
      