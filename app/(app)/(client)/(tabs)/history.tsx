import { View, Text } from '@/components/Themed';
import { ActivityIndicator, StyleSheet, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'expo-router';
import type { WorkoutSession } from '@/lib/api.types';
import { workoutSessionRepository } from '@/lib/repositories/workoutSessionRepository';
import withObservables from '@nozbe/with-observables';
import useAuthStore from '@/store/authStore';
import { useMemo } from 'react';

function HistoryScreen({ sessions }: { sessions: any[] }) {
    const router = useRouter();
    const { user } = useAuthStore();

    // Filter sessions for current user and sort by date
    const userSessions = useMemo(() => {
        if (!user?.id) return [];
        return sessions
            .filter(session => session.userId === user.id)
            .sort((a, b) => b.startedAt - a.startedAt); // Most recent first
    }, [sessions, user?.id]);

    const renderItem = ({ item }: { item: any }) => (
        <Pressable onPress={() => router.push(`/session/${item.id}`)}>
            <Card style={{ padding: 16, marginVertical: 8 }}>
                <Text style={{fontWeight: 'bold'}}>{item.name || 'Unnamed Workout'}</Text>
                <Text>{new Date(item.startedAt).toDateString()}</Text>
                <Text style={{fontSize: 12, color: 'gray'}}>
                    Status: {item.status} • Duration: {item.finishedAt ?
                        Math.round((item.finishedAt - item.startedAt) / 1000 / 60) + ' min' :
                        'In progress'
                    }
                </Text>
            </Card>
        </Pressable>
    );

    if (!user?.id) {
        return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>
    }

    return (
        <SafeAreaView style={styles.container}>
            <VStack style={{ paddingHorizontal: 16, gap: 16, flex: 1 }}>
                <UIText variant="h3">History</UIText>
                <FlatList
                    data={userSessions}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text>No workouts found.</Text>}
                />
            </VStack>
        </SafeAreaView>
    );
}

const enhance = withObservables([], () => ({
  sessions: workoutSessionRepository.observeWorkoutSessions(),
}));

export default enhance(HistoryScreen);

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
      