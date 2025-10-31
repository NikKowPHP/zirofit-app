import { View, Text } from '@/components/Themed';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getSessionDetails } from '@/lib/api';

export default function SessionDetailScreen() {
    const { id } = useLocalSearchParams();
    const { data: session, isLoading, error } = useQuery({
        queryKey: ['session', id],
        queryFn: () => getSessionDetails(id as string),
        enabled: !!id,
    });

    if (isLoading) {
        return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>
    }

    if (error) {
        return <SafeAreaView style={styles.center}><Text>Error fetching session details.</Text></SafeAreaView>
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: session?.name || `Session ${id}` }} />
            <View style={styles.content}>
                <FlatList
                    data={session.exercises}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.exerciseContainer}>
                            <Text style={styles.exerciseTitle}>{item.name}</Text>
                            {session.logs?.filter((log: any) => log.exercise_id === item.id).map((log: any, index: number) => (
                                <Text key={log.id}>Set {index + 1}: {log.reps} reps @ {log.weight} kg</Text>
                            ))}
                        </View>
                    )}
                    ListHeaderComponent={<Text style={styles.title}>Workout Summary</Text>}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center'},
    content: { padding: 15 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    exerciseContainer: {
        marginBottom: 15,
    },
    exerciseTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    }
});
      