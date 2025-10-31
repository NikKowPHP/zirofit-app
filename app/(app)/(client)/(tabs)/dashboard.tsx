import { useQuery } from '@tanstack/react-query';
import { View, Text } from '@/components/Themed';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { YStack, H3 } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import UpcomingSessions from '@/components/dashboard/UpcomingSessions';
import FindTrainerPrompt from '@/components/dashboard/FindTrainerPrompt';
import { getClientDashboard } from '@/lib/api';

export default function DashboardScreen() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboard'],
        queryFn: getClientDashboard
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
                {data?.upcomingSessions && data.upcomingSessions.length > 0 && <UpcomingSessions sessions={data.upcomingSessions} />}
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
      