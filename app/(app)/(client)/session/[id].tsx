import { View, Text } from '@/components/Themed';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { withObservables } from '@nozbe/watermelondb/react';
import { workoutSessionRepository, clientExerciseLogRepository, exerciseRepository } from '@/lib/repositories';
import WorkoutSession from '@/lib/db/models/WorkoutSession';
import ClientExerciseLog from '@/lib/db/models/ClientExerciseLog';
import Exercise from '@/lib/db/models/Exercise';
import React from 'react';

interface SessionDetailScreenProps {
  session: WorkoutSession[];
  exerciseLogs: ClientExerciseLog[];
  exercises: Exercise[];
}

function SessionDetailScreen({ session, exerciseLogs, exercises }: SessionDetailScreenProps) {
    const { id } = useLocalSearchParams();
    const sessionId = id as string;

    const sessionData = session.length > 0 ? session[0] : null;

    if (!sessionData) {
        return <SafeAreaView style={styles.center}><Text>Session not found.</Text></SafeAreaView>
    }

    // Create a map of exercise logs by exercise ID for easier lookup
    const logsByExercise = exerciseLogs.reduce((acc, log) => {
        if (!acc[log.exerciseId]) {
            acc[log.exerciseId] = [];
        }
        acc[log.exerciseId].push(log);
        return acc;
    }, {} as Record<string, ClientExerciseLog[]>);

    // Get exercises that are relevant to this session (from logs or from session template)
    const relevantExercises = exercises.filter(exercise =>
        logsByExercise[exercise.id] && logsByExercise[exercise.id].length > 0
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: sessionData?.name || `Session ${sessionId}` }} />
            <View style={styles.content}>
                <FlatList
                    data={relevantExercises}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const exerciseLogs = logsByExercise[item.id] || [];
                        return (
                            <View style={styles.exerciseContainer}>
                                <Text style={styles.exerciseTitle}>{item.name}</Text>
                                {exerciseLogs.map((log, index) => {
                                    const sets = JSON.parse(log.sets);
                                    const latestSet = sets[sets.length - 1];
                                    return (
                                        <Text key={log.id}>Set {index + 1}: {latestSet.reps} reps @ {latestSet.weight} kg</Text>
                                    );
                                })}
                            </View>
                        );
                    }}
                    ListHeaderComponent={<Text style={styles.title}>Workout Summary</Text>}
                    ListEmptyComponent={<Text>No exercises logged for this session.</Text>}
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

// Wrap component with withObservables for reactive data
const enhance = (WrappedComponent: React.ComponentType<any>) => {
    return (props: any) => {
        const { id } = useLocalSearchParams();
        const sessionId = id as string;

        const EnhancedComponent = withObservables([], () => ({
            session: workoutSessionRepository.observeWorkoutSession(sessionId),
            exerciseLogs: clientExerciseLogRepository.observeClientExerciseLogsForSession(sessionId),
            exercises: exerciseRepository.observeExercises(),
        }))(WrappedComponent);

        return <EnhancedComponent {...props} sessionId={sessionId} />;
    };
};

export default enhance(SessionDetailScreen);