import { View, Text } from '@/components/Themed';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { H3, YStack } from 'tamagui';
import { Card } from '@/components/ui/Card';
import { getTrainerDashboard } from '@/lib/api';

export default function TrainerDashboard() {
    const { data, isLoading } = useQuery({ queryKey: ['trainerDashboard'], queryFn: getTrainerDashboard });

    if (isLoading) {
        return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" padding="$4">
                <H3>Trainer Dashboard</H3>
                <Card padding="$4">
                    <Text>Upcoming Appointments: {data?.upcomingAppointments}</Text>
                    <Text>Active Clients: {data?.activeClients}</Text>
                </Card>
            </YStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
      