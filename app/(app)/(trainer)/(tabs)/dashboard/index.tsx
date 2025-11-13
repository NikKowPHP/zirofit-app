import { View, Text } from '@/components/Themed';
import { ActivityIndicator, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { useTokens } from '@/hooks/useTheme';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Section } from '@/components/ui/Section';
import { List } from '@/components/ui/List';
import { getDashboard } from '@/lib/api';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';

export default function TrainerDashboard() {
    const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard });
    const tokens = useTokens();

    if (isLoading) {
        return <Screen center><ActivityIndicator /></Screen>
    }
    
    return (
        <Screen>
            <ScrollView>
                <VStack style={{ gap: tokens.spacing.lg, padding: tokens.spacing.lg }}>
                    <UIText variant="h3">Trainer Dashboard</UIText>

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
                        <Card>
                            <Text>Active Clients: {data?.clients?.filter((c: {status: string}) => c.status === 'active').length || 0}</Text>
                        </Card>
                    </Section>

                    {data?.upcomingSessions && data.upcomingSessions.length > 0 && (
                         <Section title="Upcoming Sessions">
                             <Card>
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
                                    <Card key={index}>
                                        <Text>{item.type} - {item.clientName}</Text>
                                        <Text style={{ fontSize: 12, marginTop: 4, color: tokens.colors.light.textSecondary }}>{new Date(item.date).toLocaleString()}</Text>
                                    </Card>
                                ))}
                            </List>
                        ) : (
                            <Text style={{textAlign: 'center', marginTop: 16}}>No recent activity.</Text>
                        )}
                    </Section>
                </VStack>
            </ScrollView>
        </Screen>
    );
}