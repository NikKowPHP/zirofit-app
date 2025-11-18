import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { Text } from '@/components/Themed';
import { Card } from '@/components/ui/Card';
import { List } from '@/components/ui/List';
import { Screen } from '@/components/ui/Screen';
import { Section } from '@/components/ui/Section';
import { VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { useTokens } from '@/hooks/useTheme';
import { debugDatabase } from '@/lib/db';
import { clientRepository } from '@/lib/repositories/clientRepository';
import { dashboardRepository } from '@/lib/repositories/dashboardRepository';
import { syncManager } from '@/lib/sync/syncManager';
import { syncService } from '@/lib/sync/syncService';
import useAuthStore from '@/store/authStore';
import withObservables from '@nozbe/with-observables';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';

function TrainerDashboard({ dashboardData }: { dashboardData: any }) {
    const tokens = useTokens();
    const [isSyncing, setIsSyncing] = useState(false);
    const user = useAuthStore(state => state.user);

    const handleManualSync = async () => {
        setIsSyncing(true);
        try {
            await syncManager.forceSync();
            console.log('Manual sync completed');
        } catch (error) {
            console.error('Manual sync failed:', error);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <Screen>
            <ScrollView>
                <VStack style={{ gap: tokens.spacing.lg, padding: tokens.spacing.lg }}>
                    <UIText variant="h3">Trainer Dashboard</UIText>

                    {/* Debug and Test Buttons */}
                    {__DEV__ && (
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
                                if (!user?.id) {
                                    console.error('Cannot create test client: user not logged in');
                                    return;
                                }
                                const testClientId = `test-client-${Date.now()}`
                                await clientRepository.createClient({
                                    name: 'Test Client',
                                    email: `test${Date.now()}@example.com`,
                                    status: 'active',
                                    goals: 'Get fit and healthy',
                                    trainerId: user.id
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

                        <TouchableOpacity
                            onPress={handleManualSync}
                            disabled={isSyncing}
                            style={{
                                backgroundColor: isSyncing ? '#ccc' : '#007bff',
                                padding: tokens.spacing.sm,
                                borderRadius: 4,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: 8
                            }}
                        >
                            {isSyncing && <ActivityIndicator size="small" color="white" />}
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                {isSyncing ? '🔄 Syncing...' : '🔄 Manual Sync'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={async () => {
                                if (!user?.id) {
                                    console.error('Cannot create test program: user not logged in');
                                    return;
                                }
                                try {
                                    await trainerProgramRepository.createTrainerProgram({
                                        trainerId: user.id,
                                        name: `Test Program ${Date.now()}`,
                                        description: 'This is a test program created for development',
                                        isActive: true
                                    });
                                    console.log('✅ Created test program');
                                } catch (error) {
                                    console.error('❌ Failed to create test program:', error);
                                }
                            }}
                            style={{
                                backgroundColor: '#9c27b0',
                                padding: tokens.spacing.sm,
                                borderRadius: 4,
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>📋 Create Test Program</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={async () => {
                                if (!user?.id) {
                                    console.error('Cannot create test calendar event: user not logged in');
                                    return;
                                }
                                try {
                                    const now = Date.now();
                                    const oneHourLater = now + (60 * 60 * 1000);
                                    await calendarEventRepository.createCalendarEvent({
                                        trainerId: user.id,
                                        title: `Test Session ${new Date(now).toLocaleTimeString()}`,
                                        startTime: now,
                                        endTime: oneHourLater,
                                        notes: 'This is a test calendar event',
                                        status: 'scheduled',
                                        sessionType: 'training'
                                    });
                                    console.log('✅ Created test calendar event');
                                } catch (error) {
                                    console.error('❌ Failed to create test calendar event:', error);
                                }
                            }}
                            style={{
                                backgroundColor: '#ff9800',
                                padding: tokens.spacing.sm,
                                borderRadius: 4,
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>📅 Create Test Calendar Event</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={async () => {
                                if (!user?.id) {
                                    console.error('Cannot create test profile: user not logged in');
                                    return;
                                }
                                try {
                                    // Check if profile already exists
                                    const existingProfile = await profileRepository.getCurrentUserProfile(user.id);
                                    if (existingProfile) {
                                        console.log('⚠️ Profile already exists, updating instead');
                                        await profileRepository.updateProfile(existingProfile.id, {
                                            aboutMe: `Updated test profile at ${new Date().toLocaleString()}`,
                                            philosophy: 'Train hard, stay consistent',
                                            specialties: JSON.stringify(['Strength Training', 'Weight Loss']),
                                            trainingTypes: JSON.stringify(['One-on-One', 'Group Classes']),
                                            minServicePrice: 50
                                        });
                                        console.log('✅ Updated existing profile');
                                    } else {
                                        await profileRepository.createProfile({
                                            userId: user.id,
                                            aboutMe: 'This is a test profile created for development',
                                            philosophy: 'Train hard, stay consistent',
                                            specialties: JSON.stringify(['Strength Training', 'Weight Loss']),
                                            trainingTypes: JSON.stringify(['One-on-One', 'Group Classes']),
                                            minServicePrice: 50
                                        });
                                        console.log('✅ Created test profile');
                                    }
                                } catch (error) {
                                    console.error('❌ Failed to create/update test profile:', error);
                                }
                            }}
                            style={{
                                backgroundColor: '#00bcd4',
                                padding: tokens.spacing.sm,
                                borderRadius: 4,
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>👤 Create/Update Test Profile</Text>
                        </TouchableOpacity>
                    </VStack>
                    )}

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