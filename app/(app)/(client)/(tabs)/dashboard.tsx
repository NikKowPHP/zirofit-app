import { useQuery } from '@tanstack/react-query';
import { View, Text } from '@/components/Themed';
import { ActivityIndicator, Alert } from 'react-native';
import { YStack, H3 } from 'tamagui';
import { Screen } from '@/components/ui/Screen';
import UpcomingSessions from '@/components/dashboard/UpcomingSessions';
import FindTrainerPrompt from '@/components/dashboard/FindTrainerPrompt';
import { getDashboard } from '@/lib/api';
import { router } from 'expo-router';
import useAuthStore from '@/store/authStore';

export default function DashboardScreen() {
    const { authenticationState } = useAuthStore();
    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboard'],
        queryFn: getDashboard,
        enabled: authenticationState === 'authenticated',
        retry: false
    });

    if (isLoading) {
        return <Screen center><ActivityIndicator /></Screen>
    }

    if (error) {
        // Handle authentication errors specifically
        if (error.message?.includes('Missing or invalid Authorization header') ||
            error.message?.includes('401')) {
            Alert.alert(
                'Authentication Required',
                'Please log in to view your dashboard',
                [
                    { text: 'OK', onPress: () => router.replace('/(auth)/login') }
                ]
            );
            return <Screen center><Text>Redirecting to login...</Text></Screen>
        }
        
        return <Screen center><Text>Error fetching data: {error.message}</Text></Screen>
    }

    // If not authenticated, show login prompt
    if (authenticationState === 'unauthenticated') {
        return (
            <Screen center>
                <YStack space="$4" alignItems="center">
                    <H3>Authentication Required</H3>
                    <Text>Please log in to view your dashboard</Text>
                    <Text onPress={() => router.replace('/(auth)/login')} style={{ color: 'blue' }}>
                        Go to Login
                    </Text>
                </YStack>
            </Screen>
        );
    }

    return (
        <Screen>
            <H3>Dashboard</H3>
            {data?.upcomingSessions && data.upcomingSessions.length > 0 && <UpcomingSessions sessions={data.upcomingSessions} />}
            {!data?.hasTrainer && <FindTrainerPrompt />}
        </Screen>
    )
}
      