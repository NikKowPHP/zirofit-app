import { View, Text } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { useState, useMemo } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack, HStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { useTokens } from '@/hooks/useTheme';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getActiveClientWorkoutSession, logSet, finishWorkoutSession } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { WorkoutSession, ClientExerciseLog } from '@/lib/api.types';

type WorkoutExercise = { id: string; name: string; };

export default function LiveWorkoutScreen() {
    const { id: clientId } = useLocalSearchParams();
    const queryClient = useQueryClient();
    const tokens = useTokens();
    
    // State for trainer-side logging
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');

    const { data: session, isLoading, error } = useQuery<WorkoutSession | null>({
        queryKey: ['activeClientSession', clientId],
        queryFn: () => getActiveClientWorkoutSession(clientId as string),
        enabled: !!clientId,
        // Refetch every 5 seconds as a temporary replacement for real-time updates
        refetchInterval: 5000, 
    });

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
    
    const sortedLogs = useMemo(() => {
        return (session?.logs || []).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [session?.logs]);

    if (isLoading) return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>;
    if (error || !session) return <SafeAreaView style={styles.center}><Text>Client does not have an active workout session.</Text></SafeAreaView>;

    return (
        <SafeAreaView style={styles.container}>
            <VStack style={{ gap: tokens.spacing.lg, paddingHorizontal: tokens.spacing.lg, flex: 1 }}>
                <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <UIText variant="h4">Live Feed: {session.name || 'Unnamed Workout'}</UIText>
                    <Button variant="danger" onPress={() => finishWorkoutMutation.mutate()} disabled={finishWorkoutMutation.isPending}>
                        Finish Workout
                    </Button>
                </HStack>
                <FlatList
                    data={session.exercises || []}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const exerciseLogs = sortedLogs.filter(log => log.exercise_id === item.id);
                        return (
                            <Card style={{ marginVertical: tokens.spacing.sm }}>
                                <UIText variant="h5">{item.name}</UIText>
                                {exerciseLogs.length > 0 ? (
                                    exerciseLogs.map((log, index) => (
                                        <Text key={log.id}>Set {exerciseLogs.length - index}: {log.reps} reps @ {log.weight} kg</Text>
                                    ))
                                ) : (
                                    <Text style={styles.timestamp}>No sets logged yet.</Text>
                                )}
                                <HStack style={{ gap: tokens.spacing.sm, alignItems: 'center', marginTop: tokens.spacing.md }}>
                                    <Input placeholder="Reps" keyboardType="numeric" value={reps} onChangeText={setReps} style={{ flex: 1 }} />
                                    <Input placeholder="Weight" keyboardType="numeric" value={weight} onChangeText={setWeight} style={{ flex: 1 }} />
                                    <Button style={{ flex: 1 }} onPress={() => logSetMutation.mutate({ exercise_id: item.id })} disabled={logSetMutation.isPending}>Log Set</Button>
                                </HStack>
                            </Card>
                        )
                    }}
                    ListEmptyComponent={<Text>Waiting for client to start logging...</Text>}
                />
            </VStack>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    timestamp: { fontSize: 12, color: '#666', marginTop: 4, }
});
      