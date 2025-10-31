import { View, Text } from '@/components/Themed';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import { StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, H4, H5 } from 'tamagui';
import { useQuery } from '@tanstack/react-query';
import { getActiveClientWorkoutSession } from '@/lib/api';
import { Card } from '@/components/ui/Card';

type ClientExerciseLog = { id: string; reps: number; weight: number; created_at: string; exercise_id: string; };
type WorkoutExercise = { id: string; name: string; };
type WorkoutSession = { id: string; name: string; exercises: WorkoutExercise[], logs: ClientExerciseLog[] };

export default function LiveWorkoutScreen() {
    const { id: clientId } = useLocalSearchParams();
    const [liveLogs, setLiveLogs] = useState<ClientExerciseLog[]>([]);

    const { data: session, isLoading, error } = useQuery<WorkoutSession>({
        queryKey: ['activeClientSession', clientId],
        queryFn: () => getActiveClientWorkoutSession(clientId as string),
        enabled: !!clientId,
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
    
    if (isLoading) {
        return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>
    }
    
    if (error || !session) {
        return <SafeAreaView style={styles.center}><Text>Client does not have an active workout session.</Text></SafeAreaView>
    }

    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" paddingHorizontal="$4" flex={1}>
                <H4>Live Feed: {session.name}</H4>
                <FlatList
                    data={session.exercises}
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
    timestamp: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    }
});
      