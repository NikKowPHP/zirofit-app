import { View, Text } from '@/components/Themed';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getTrainerProfile } from '@/lib/api';
import { YStack, H3, Avatar } from 'tamagui';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const { data: profile, isLoading } = useQuery({ queryKey: ['trainerProfile'], queryFn: getTrainerProfile });
    const router = useRouter();
    
    if (isLoading) {
        return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>
    }

    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" padding="$4" alignItems='center'>
                <H3>My Profile</H3>
                <Card padding="$4" alignItems='center' width="100%">
                    <Avatar circular size="$10">
                        <Avatar.Image src={profile.avatar_url} />
                        <Avatar.Fallback bc="blue" />
                    </Avatar>
                    <H3 mt="$2">{profile.name}</H3>
                    <Text>{profile.email}</Text>

                    <Button mt="$4" onPress={() => router.push('/(trainer)/(tabs)/profile/edit')}>
                        Edit Profile
                    </Button>
                </Card>
            </YStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
      