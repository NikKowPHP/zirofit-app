import { View, Text } from '@/components/Themed';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, H4 } from 'tamagui';

type ClientExerciseLog = { id: string; reps: number; weight: number; created_at: string };

export default function LiveWorkoutScreen() {
    const { id: clientId } = useLocalSearchParams();
    const [logs, setLogs] = useState<ClientExerciseLog[]>([]);

    useEffect(() => {
        // Assume we know the active session ID, or listen to all logs for this client
        const channel = supabase
            .channel(`client-log-stream-${clientId}`)
            .on<ClientExerciseLog>(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'ClientExerciseLog' /*, filter: `client_id=eq.${clientId}`*/ },
                (payload) => {
                    console.log('New log received!', payload.new);
                    setLogs(currentLogs => [payload.new, ...currentLogs]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [clientId]);
    
    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" padding="$4" flex={1}>
                <H4>Live Feed for Client {clientId}</H4>
                <FlatList
                    data={logs}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.logItem}>
                            <Text>Set Logged: {item.reps} reps @ {item.weight} kg</Text>
                            <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleTimeString()}</Text>
                        </View>
                    )}
                    ListEmptyComponent={<Text>Waiting for client to log a set...</Text>}
                    inverted
                />
            </YStack>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    logItem: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginBottom: 10,
    },
    timestamp: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    }
});
      