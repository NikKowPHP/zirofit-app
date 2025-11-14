import { View, Text } from '@/components/Themed';
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { useTokens } from '@/hooks/useTheme';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Section } from '@/components/ui/Section';
import { List } from '@/components/ui/List';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { dashboardRepository } from '@/lib/repositories/dashboardRepository';
import withObservables from '@nozbe/with-observables';
import { debugDatabase } from '@/lib/db';
import { syncService } from '@/lib/sync/syncService';
import { clientRepository } from '@/lib/repositories/clientRepository';

function TrainerDashboard({ dashboardData }: { dashboardData: any }) {
    const tokens = useTokens();

    return (
        <Screen>
            <ScrollView>
                <VStack style={{ gap: tokens.spacing.lg, padding: tokens.spacing.lg }}>
                    <UIText variant="h3">Trainer Dashboard</UIText>

                    {/* Debug and Test Buttons */}
                    <VStack style={{ gap: tokens.spacing.sm }}>
                        <TouchableOpacity
                            onPress={() => debugDatabase()}
                            style={{
                                backgroundColor: tokens.colors.light.primary,
                                padding: tokens.spacing.sm,
                                borderRadius: 4,
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>🔍 Debug Database</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={async () => {
                                const testClientId = `test-client-${Date.now()}`
                                await clientRepository.createClient({
                                    name: 'Test Client',
                                    email: `test${Date.now()}@example.com`,
                                    status: 'active',
                                    goals: 'Get fit and healthy'
                                })
                                console.log('Created test client:', testClientId)
                            }}
                            style={{
                                backgroundColor: '#28a745',
                                padding: tokens.spacing.sm,
                                borderRadius: 4,
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>➕ Create Test Client</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={async () => {
                                await syncService.resetSyncTimestamp()
                                // Trigger a new sync
                                await syncService.pullChanges()
                            }}
                            style={{
                                backgroundColor: '#ff6b6b',
                                padding: tokens.spacing.sm,
                                borderRadius: 4,
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>🔄 Reset Sync</Text>
                        </TouchableOpacity>
                    </VStack>

                    {dashboardData?.businessPerformance && (
                        <AnalyticsChart title="Business Performance" data={[
                            { label: "Current Month Revenue", value: dashboardData.businessPerformance.currentMonth.revenue },
                            { label: "Previous Month Revenue", value: dashboardData.businessPerformance.previousMonth.revenue }
                        ]} />
                    )}

                    {dashboardData?.clientEngagement && (
                        <AnalyticsChart title="Client Engagement" data={[
                            { label: "Active Clients", value: dashboardData.clientEngagement.active.length },
                            { label: "At Risk Clients", value: dashboardData.clientEngagement.atRisk.length },
                            { label: "Slipping Clients", value: dashboardData.clientEngagement.slipping.length }
                        ]} />
                    )}

                    <Section title="Quick Stats">
                        <Card>
                            <Text>Active Clients: {dashboardData?.clients?.filter((c: {status: string}) => c.status === 'active').length || 0}</Text>
                        </Card>
                    </Section>

                    {dashboardData?.upcomingSessions && dashboardData.upcomingSessions.length > 0 && (
                         <Section title="Upcoming Sessions">
                             <Card>
                                 <List>
                                     {dashboardData.upcomingSessions.map((s: any) => (
                                         <Text key={s.id}>{s.clientName} - {new Date(s.time).toLocaleString()}</Text>
                                     ))}
                                 </List>
                             </Card>
                         </Section>
                    )}

                    <Section title="Recent Activity">
                        {dashboardData?.activityFeed && dashboardData.activityFeed.length > 0 ? (
                            <List>
                                {dashboardData.activityFeed.map((item: any, index: number) => (
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

const enhance = withObservables([], () => ({
  dashboardData: dashboardRepository.observeDashboardData(),
}));

export default enhance(TrainerDashboard);