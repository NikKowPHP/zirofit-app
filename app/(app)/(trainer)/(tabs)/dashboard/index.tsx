import { View, Text } from '@/components/Themed';
import { ActivityIndicator, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { H3, YStack } from 'tamagui';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Section } from '@/components/ui/Section';
import { List } from '@/components/ui/List';
import { getDashboard } from '@/lib/api';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';

export default function TrainerDashboard() {
    const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard });

    if (isLoading) {
        return <Screen center><ActivityIndicator /></Screen>
    }
    
    return (
        <Screen>
            <ScrollView>
                <YStack space="$4" padding="$4">
                    <H3>Trainer Dashboard</H3>

                    {data?.businessPerformance && (
                        <AnalyticsChart title="Business Performance" data={[
                            { label: "Current Month Revenue", value: data.businessPerformance.currentMonth.revenue },
                            { label: "Previous Month Revenue", value: data.businessPerformance.previousMonth.revenue }
                        ]} />
                    )}

                    {data?.clientEngagement && (
                        <AnalyticsChart title="Client Engagement" data={[
                            { label: "Active Clients", value: data.clientEngagement.active.length },
                            { label: "At Risk Clients", value: data.clientEngagement.atRisk.length },
                            { label: "Slipping Clients", value: data.clientEngagement.slipping.length }
                        ]} />
                    )}

                    <Section title="Quick Stats">
                        <Card padding="$4">
                            <Text>Active Clients: {data?.clients?.filter((c: {status: string}) => c.status === 'active').length || 0}</Text>
                        </Card>
                    </Section>

                    {data?.upcomingSessions && data.upcomingSessions.length > 0 && (
                         <Section title="Upcoming Sessions">
                             <Card padding="$4">
                                 <List>
                                     {data.upcomingSessions.map((s: any) => (
                                         <Text key={s.id}>{s.clientName} - {new Date(s.time).toLocaleString()}</Text>
                                     ))}
                                 </List>
                             </Card>
                         </Section>
                    )}

                    <Section title="Recent Activity">
                        {data?.activityFeed && data.activityFeed.length > 0 ? (
                            <List>
                                {data.activityFeed.map((item: any, index: number) => (
                                    <Card key={index} padding="$3">
                                        <Text>{item.type} - {item.clientName}</Text>
                                        <Text lightColor="$color.textSecondary" darkColor="$color.textSecondary" style={{ fontSize: 12, marginTop: 4 }}>{new Date(item.date).toLocaleString()}</Text>
                                    </Card>
                                ))}
                            </List>
                        ) : (
                            <Text style={{textAlign: 'center', marginTop: 16}}>No recent activity.</Text>
                        )}
                    </Section>
                </YStack>
            </ScrollView>
        </Screen>
    );
}