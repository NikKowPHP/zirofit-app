import { View, Text } from '@/components/Themed';
import { ActivityIndicator, StyleSheet, Pressable, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'expo-router';
import { getWorkoutHistory } from '@/lib/api';
import type { WorkoutSession } from '@/lib/api.types';

export default function HistoryScreen() {
    const router = useRouter();
    const { data, isLoading } = useQuery({ queryKey: ['history'], queryFn: getWorkoutHistory });

    const renderItem = ({ item }: { item: WorkoutSession }) => (
        <Pressable onPress={() => router.push(`/session/${item.id}`)}>
            <Card style={{ padding: 16, marginVertical: 8 }}>
                <Text style={{fontWeight: 'bold'}}>{item.name || 'Unnamed Workout'}</Text>
                <Text>{new Date(item.started_at).toDateString()}</Text>
            </Card>
        </Pressable>
    );

    if (isLoading) {
        return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>
    }

    return (
        <SafeAreaView style={styles.container}>
            <VStack style={{ paddingHorizontal: 16, gap: 16, flex: 1 }}>
                <UIText variant="h3">History</UIText>
                <FlatList
                    data={data || []}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text>No workouts found.</Text>}
                />
            </VStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
      