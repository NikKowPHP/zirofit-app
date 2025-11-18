import { Text } from '@/components/Themed';
import FindTrainerPrompt from '@/components/dashboard/FindTrainerPrompt';
import UpcomingSessions from '@/components/dashboard/UpcomingSessions';
import { Screen } from '@/components/ui/Screen';
import { VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { clientDashboardRepository } from '@/lib/repositories/clientDashboardRepository';
import useAuthStore from '@/store/authStore';
import withObservables from '@nozbe/with-observables';
import { router } from 'expo-router';
import { ActivityIndicator } from 'react-native';

function DashboardScreen({ dashboardData }: { dashboardData: any }) {
    const { authenticationState, user } = useAuthStore();

    // Role should be determined during authentication flow in app index

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
      