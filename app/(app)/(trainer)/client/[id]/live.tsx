import { View, Text } from '@/components/Themed';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, H4, H5, XStack } from 'tamagui';
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
    const [liveLogs, setLiveLogs] = useState<ClientExerciseLog[]>([]);
    
    // State for trainer-side logging
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');

    const { data: session, isLoading, error, refetch } = useQuery<WorkoutSession | null>({
        queryKey: ['activeClientSession', clientId],
        queryFn: () => getActiveClientWorkoutSession(clientId as string),
        enabled: !!clientId,
    });

    const finishWorkoutMutation = useMutation({
        mutationFn: () => finishWorkoutSession(session!.id),
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
            refetch();
        },
        onError: (e: any) => Alert.alert('Error', e.message),
    });

    useEffect(() => {
        if (!clientId) return;

        const channel = supabase
            .channel(`client-log-stream-${clientId}`)
            .on<ClientExerciseLog>(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'ClientExerciseLog' /*, filter: `client_id=eq.${clientId}`*/ },
                (payload) => {
                    console.log('New log received!', payload.new);
                    setLiveLogs(currentLogs => [payload.new, ...currentLogs]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [clientId]);

    const combinedLogs = useMemo(() => {
        const allLogs = [...(session?.logs || []), ...liveLogs];
        const uniqueLogs = Array.from(new Map(allLogs.map(log => [log.id, log])).values());
        return uniqueLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [session?.logs, liveLogs]);
    
    if (isLoading) return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>;
    if (error || !session) return <SafeAreaView style={styles.center}><Text>Client does not have an active workout session.</Text></SafeAreaView>;

    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" paddingHorizontal="$4" flex={1}>
                <XStack justifyContent='space-between' alignItems='center'>
                    <H4>Live Feed: {session.name || 'Unnamed Workout'}</H4>
                    <Button size="$3" variant="danger" onPress={() => finishWorkoutMutation.mutate()} disabled={finishWorkoutMutation.isPending}>
                        Finish Workout
                    </Button>
                </XStack>
                <FlatList
                    data={session.exercises || []}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const exerciseLogs = combinedLogs.filter(log => log.exercise_id === item.id);
                        return (
                            <Card padding="$3" marginVertical="$2">
                                <H5>{item.name}</H5>
                                {exerciseLogs.length > 0 ? (
                                    exerciseLogs.map((log, index) => (
                                        <Text key={log.id}>Set {exerciseLogs.length - index}: {log.reps} reps @ {log.weight} kg</Text>
                                    ))
                                ) : (
                                    <Text style={styles.timestamp}>No sets logged yet.</Text>
                                )}
                                <XStack space="$2" alignItems="center" mt="$3">
                                    <Input placeholder="Reps" keyboardType="numeric" value={reps} onChangeText={setReps} flex={1} />
                                    <Input placeholder="Weight" keyboardType="numeric" value={weight} onChangeText={setWeight} flex={1} />
                                    <Button flex={1} onPress={() => logSetMutation.mutate({ exercise_id: item.id })} disabled={logSetMutation.isPending}>Log Set</Button>
                                </XStack>
                            </Card>
                        )
                    }}
                    ListEmptyComponent={<Text>Waiting for client to start logging...</Text>}
                />
            </YStack>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    timestamp: { fontSize: 12, color: '#666', marginTop: 4, }
});
      