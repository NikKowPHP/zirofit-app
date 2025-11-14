import { useEffect, useMemo } from 'react';
import { View, Text } from '@/components/Themed';
import { ActivityIndicator, Alert } from 'react-native';
import { VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { Screen } from '@/components/ui/Screen';
import UpcomingSessions from '@/components/dashboard/UpcomingSessions';
import FindTrainerPrompt from '@/components/dashboard/FindTrainerPrompt';
import { router } from 'expo-router';
import useAuthStore from '@/store/authStore';
import { clientDashboardRepository } from '@/lib/repositories/clientDashboardRepository';
import withObservables from '@nozbe/with-observables';

function DashboardScreen({ dashboardData }: { dashboardData: any }) {
    const { authenticationState, profile, user } = useAuthStore();

    // Handle redirect for non-client users
    useEffect(() => {
        if (authenticationState === 'authenticated' && profile?.role !== 'client') {
            router.replace('/(app)/(trainer)');
        }
    }, [authenticationState, profile?.role]);

    // If not authenticated, show login prompt
    if (authenticationState === 'unauthenticated') {
        return (
            <Screen center>
                <VStack style={{ gap: 16, alignItems: 'center' }}>
                    <UIText variant="h3">Authentication Required</UIText>
                    <Text>Please log in to view your dashboard</Text>
                    <Text onPress={() => router.replace('/(auth)/login')} style={{ color: 'blue' }}>
                        Go to Login
                    </Text>
                </VStack>
            </Screen>
        );
    }

    // Don't show data until we have a user ID
    if (!user?.id) {
        return <Screen center><ActivityIndicator /></Screen>
    }

    return (
        <Screen>
            <UIText variant="h3">Dashboard</UIText>
            {dashboardData?.upcomingSessions && dashboardData.upcomingSessions.length > 0 && (
                <UpcomingSessions sessions={dashboardData.upcomingSessions} />
            )}
            {!dashboardData?.hasTrainer && <FindTrainerPrompt />}
        </Screen>
    )
}

// Create enhanced component with observable data
const enhance = withObservables([], ({ userId }: { userId: string }) => ({
  dashboardData: clientDashboardRepository.observeClientDashboard(userId),
}));

// Wrapper component to get user ID
export default function DashboardScreenWrapper() {
    const { user } = useAuthStore();
    const userId = user?.id;

    if (!userId) {
        return <Screen center><ActivityIndicator /></Screen>;
    }

    const EnhancedDashboard = enhance(DashboardScreen);
    return <EnhancedDashboard userId={userId} />;
}
      