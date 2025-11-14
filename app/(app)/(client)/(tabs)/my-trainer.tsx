import { View, Text } from '@/components/Themed';
import { StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import * as WebBrowser from 'expo-web-browser';
import { createCheckoutSession } from '@/lib/api';
import { useState, useMemo } from 'react';
import FindTrainerPrompt from '@/components/dashboard/FindTrainerPrompt';
import { supabase } from '@/lib/supabase';
import { useTokens } from '@/hooks/useTheme';
import { trainerProfileRepository } from '@/lib/repositories/trainerProfileRepository';
import { trainerPackageRepository } from '@/lib/repositories/trainerPackageRepository';
import withObservables from '@nozbe/with-observables';

function MyTrainerScreen({ trainerProfiles, packages }: { trainerProfiles: any[], packages: any[] }) {
    const [loadingPackageId, setLoadingPackageId] = useState<string | null>(null);
    const tokens = useTokens();

    // For now, show the first available trainer (in a real app, filter by client-trainer relationship)
    const trainer = useMemo(() => trainerProfiles[0], [trainerProfiles]);

    const trainerPackages = useMemo(() => {
        if (!trainer) return [];
        return packages.filter(pkg => pkg.trainerId === trainer.userId);
    }, [packages, trainer]);

    const handleBuyPackage = async (packageId: string) => {
        setLoadingPackageId(packageId);
        try {
            const { url } = await createCheckoutSession(packageId);
            if (url) {
                await WebBrowser.openBrowserAsync(url);
            } else {
                Alert.alert('Error', 'Could not initiate checkout session.');
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.message || 'An unexpected error occurred.');
        } finally {
            setLoadingPackageId(null);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <SafeAreaView style={styles.container}>
            <VStack style={{ padding: tokens.spacing.lg, gap: tokens.spacing.lg, alignItems: 'center' }}>
                <UIText variant="h3">My Trainer</UIText>

                {trainer ? (
                    <>
                        <Card style={{ padding: tokens.spacing.lg, alignItems: 'center', width: '100%' }}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={{ uri: trainer.avatarUrl }}
                                    style={styles.avatar}
                                    defaultSource={require('@/assets/images/icon.png')}
                                />
                            </View>
                            <UIText variant="h3" style={{ marginTop: tokens.spacing.sm }}>{trainer.name}</UIText>
                            <Text>Certified Personal Trainer</Text>
                            <Button style={{ marginTop: tokens.spacing.lg }}>Send Message</Button>
                        </Card>

                        <Card style={{ padding: tokens.spacing.lg, width: '100%' }}>
                            <UIText variant="h3" style={{ textAlign: 'center' }}>Training Packages</UIText>
                            <VStack style={{ gap: tokens.spacing.md, marginTop: tokens.spacing.md }}>
                                {trainerPackages && trainerPackages.length > 0 ? trainerPackages.map((pkg: any) => (
                                    <Card key={pkg.id} style={{ padding: tokens.spacing.md, backgroundColor: '#f5f5f5' }}>
                                        <UIText variant="h4">{pkg.name}</UIText>
                                        <Text>{pkg.description}</Text>
                                        <Text style={styles.price}>${(pkg.price / 100).toFixed(2)}</Text>
                                        <Button
                                            style={{ marginTop: tokens.spacing.md }}
                                            variant="primary"
                                            onPress={() => handleBuyPackage(pkg.id)}
                                            disabled={!!loadingPackageId}
                                        >
                                            {loadingPackageId === pkg.id ? 'Processing...' : 'Buy Package'}
                                        </Button>
                                    </Card>
                                )) : (
                                    <Text style={styles.noPackagesText}>This trainer has not set up any packages yet.</Text>
                                )}
                            </VStack>
                        </Card>
                    </>
                ) : (
                    <FindTrainerPrompt />
                )}

                <Button variant="danger" onPress={handleLogout} style={{ width: '100%', marginTop: tokens.spacing.lg }}>
                    Logout
                </Button>
            </VStack>
        </SafeAreaView>
    );
}

const enhance = withObservables([], () => ({
  trainerProfiles: trainerProfileRepository.observeTrainerProfiles(),
  packages: trainerPackageRepository.observeTrainerPackages(),
}));

export default enhance(MyTrainerScreen);

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
        backgroundColor: '#e0e0e0',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
    noPackagesText: {
        textAlign: 'center',
        marginTop: 10,
        color: 'gray',
    }
});
      