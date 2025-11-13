import { View, Text } from '@/components/Themed';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getTrainerProfile } from '@/lib/api';
import { VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { useTokens } from '@/hooks/useTheme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
    const { data: profile, isLoading } = useQuery({ queryKey: ['trainerProfile'], queryFn: getTrainerProfile });
    const router = useRouter();
    const tokens = useTokens();
    
    if (isLoading || !profile) {
        return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        // Auth guard will redirect
    };

    return (
        <SafeAreaView style={styles.container}>
            <VStack style={{ gap: tokens.spacing.lg, padding: tokens.spacing.lg, alignItems: 'center' }}>
                <UIText variant="h3">My Profile</UIText>
                <Card style={{ alignItems: 'center', width: '100%' }}>
                    <View style={styles.avatar}>
                        <View style={[styles.avatarFallback, { backgroundColor: 'blue' }]} />
                    </View>
                    <UIText variant="h3" style={{ marginTop: tokens.spacing.sm }}>{profile.name || 'Unnamed'}</UIText>
                    <Text>{profile.email || 'No email'}</Text>

                    <Button style={{ marginTop: tokens.spacing.lg }} onPress={() => router.push('/(app)/(trainer)/(tabs)/profile/edit')}>
                        Edit Profile
                    </Button>
                    <Button style={{ marginTop: tokens.spacing.sm }} variant="danger" onPress={handleLogout}>
                        Logout
                    </Button>
                </Card>
            </VStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
    },
    avatarFallback: {
        width: '100%',
        height: '100%',
    },
});
      