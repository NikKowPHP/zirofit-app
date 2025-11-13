import { View, Text } from '@/components/Themed';
import { StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import * as WebBrowser from 'expo-web-browser';
import { createCheckoutSession, getMyTrainer, getTrainerPackages } from '@/lib/api';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import FindTrainerPrompt from '@/components/dashboard/FindTrainerPrompt';
import { supabase } from '@/lib/supabase';
import { useTokens } from '@/hooks/useTheme';

export default function MyTrainerScreen() {
    const [loadingPackageId, setLoadingPackageId] = useState<string | null>(null);
    const tokens = useTokens();
    
    const { data: trainer, isLoading: isTrainerLoading } = useQuery({ 
        queryKey: ['myTrainer'], 
        queryFn: getMyTrainer 
    });

    const trainerId = trainer?.id;
    
    const { data: packages, isLoading: arePackagesLoading } = useQuery({
        queryKey: ['trainerPackages', trainerId],
        queryFn: () => getTrainerPackages(trainerId as string),
        enabled: !!trainerId,
    });

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

    if (isTrainerLoading) {
        return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>
    }

    return (
        <SafeAreaView style={styles.container}>
            <VStack style={{ padding: tokens.spacing.lg, gap: tokens.spacing.lg, alignItems: 'center' }}>
                <UIText variant="h3">My Trainer</UIText>
                
                {trainer ? (
                    <>
                        <Card style={{ padding: tokens.spacing.lg, alignItems: 'center', width: '100%' }}>
                            <View style={styles.avatarContainer}>
                                <Image 
                                    source={{ uri: trainer.avatar_url }} 
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
                            {arePackagesLoading ? <ActivityIndicator style={{marginTop: 20}} /> : (
                                <VStack style={{ gap: tokens.spacing.md, marginTop: tokens.spacing.md }}>
                                    {packages && packages.length > 0 ? packages.map((pkg: any) => (
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
                            )}
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
      