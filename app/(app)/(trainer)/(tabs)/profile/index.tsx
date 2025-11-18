import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { useTokens } from '@/hooks/useTheme';
import { trainerProfileRepository } from '@/lib/repositories/trainerProfileRepository';
import { supabase } from '@/lib/supabase';
import withObservables from '@nozbe/with-observables';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useAuthStore from '@/store/authStore';
import { useMemo } from 'react';

function ProfileScreen({ profiles }: { profiles: any[] }) {
    const router = useRouter();
    const tokens = useTokens();
    const { user } = useAuthStore();

    // Get the current user's profile from local DB
    const profile = useMemo(() => {
        if (!user || !profiles.length) return null;
        return profiles.find(p => p.userId === user.id) || null;
    }, [profiles, user]);

    if (!profile) {
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

const enhance = withObservables([], () => ({
  profiles: trainerProfileRepository.observeTrainerProfiles(),
}));

export default enhance(ProfileScreen);

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
      