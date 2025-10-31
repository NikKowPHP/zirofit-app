import { useQuery } from '@tanstack/react-query';
import { View, Text } from '@/components/Themed';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { YStack, H3 } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import UpcomingSessions from '@/components/dashboard/UpcomingSessions';
import FindTrainerPrompt from '@/components/dashboard/FindTrainerPrompt';

// Mock API call
const fetchDashboardData = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        upcomingSessions: [{ id: '1', time: 'Tomorrow at 10:00 AM', trainer: 'Jane Doe' }],
        hasTrainer: true,
    };
};

export default function DashboardScreen() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboard'],
        queryFn: fetchDashboardData
    });

    if (isLoading) {
        return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>
    }

    if (error) {
        return <SafeAreaView style={styles.center}><Text>Error fetching data</Text></SafeAreaView>
    }

    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" padding="$4">
                <H3>Dashboard</H3>
                {data?.upcomingSessions && <UpcomingSessions sessions={data.upcomingSessions} />}
                {!data?.hasTrainer && <FindTrainerPrompt />}
            </YStack>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
      