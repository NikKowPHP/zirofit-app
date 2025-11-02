import { View, Text } from '@/components/Themed';
import { StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { H3, H5, YStack } from 'tamagui';
import { Card } from '@/components/ui/Card';
import { getDashboard } from '@/lib/api';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';

export default function TrainerDashboard() {
    const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard });

    if (isLoading) {
        return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <YStack space="$4" padding="$4">
                    <H3>Trainer Dashboard</H3>

                    {data?.businessPerformance && (
                        <AnalyticsChart title="Business Performance" data={data.businessPerformance} />
                    )}

                    {data?.clientEngagement && (
                        <AnalyticsChart title="Client Engagement" data={data.clientEngagement} />
                    )}

                    <Card padding="$4">
                        <H5>Quick Stats</H5>
                        <Text>Upcoming Appointments: {data?.upcomingAppointments}</Text>
                        <Text>Active Clients: {data?.activeClients}</Text>
                    </Card>

                    {data?.upcomingSessions && data.upcomingSessions.length > 0 && (
                         <Card padding="$4">
                            <H5>Upcoming Sessions</H5>
                            {data.upcomingSessions.map((s: any) => (
                                <Text key={s.id}>{s.clientName} - {new Date(s.time).toLocaleString()}</Text>
                            ))}
                        </Card>
                    )}

                    <H5 mt="$4">Recent Activity</H5>
                    {data?.activityFeed && data.activityFeed.length > 0 ? (
                        data.activityFeed.map((item: any) => (
                            <Card key={item.id} marginVertical="$2" padding="$3">
                                <Text>{item.description}</Text>
                                <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
                            </Card>
                        ))
                    ) : (
                        <Text style={{textAlign: 'center', marginTop: 20}}>No recent activity.</Text>
                    )}
                </YStack>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    timestamp: {
        fontSize: 12,
        color: 'gray',
        marginTop: 4,
    }
});
      