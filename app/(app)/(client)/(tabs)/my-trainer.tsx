import { View, Text } from '@/components/Themed';
import { StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H3, YStack, Avatar, H4, Paragraph } from 'tamagui';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import * as WebBrowser from 'expo-web-browser';
import { createCheckoutSession, getMyTrainer, getTrainerPackages } from '@/lib/api';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import FindTrainerPrompt from '@/components/dashboard/FindTrainerPrompt';
import { supabase } from '@/lib/supabase';

export default function MyTrainerScreen() {
    const [loadingPackageId, setLoadingPackageId] = useState<string | null>(null);
    
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
            <YStack space="$4" padding="$4" alignItems='center'>
                <H3>My Trainer</H3>
                
                {trainer ? (
                    <>
                        <Card padding="$4" alignItems='center' width="100%">
                            <Avatar circular size="$10">
                                <Avatar.Image src={trainer.avatar_url} />
                                <Avatar.Fallback bc="blue" />
                            </Avatar>
                            <H3 mt="$2">{trainer.name}</H3>
                            <Text>Certified Personal Trainer</Text>
                            <Button mt="$4">Send Message</Button>
                        </Card>

                        <Card padding="$4" width="100%">
                            <H3 textAlign='center'>Training Packages</H3>
                            {arePackagesLoading ? <ActivityIndicator style={{marginTop: 20}} /> : (
                                <YStack space="$3" mt="$3">
                                    {packages && packages.length > 0 ? packages.map((pkg: any) => (
                                        <Card key={pkg.id} padding="$3" backgroundColor="$backgroundHover">
                                            <H4>{pkg.name}</H4>
                                            <Paragraph>{pkg.description}</Paragraph>
                                            <Text style={styles.price}>${(pkg.price / 100).toFixed(2)}</Text>
                                            <Button 
                                                mt="$3"
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
                                </YStack>
                            )}
                        </Card>
                    </>
                ) : (
                    <FindTrainerPrompt />
                )}

                <Button variant="danger" onPress={handleLogout} width="100%" marginTop="$4">
                    Logout
                </Button>
            </YStack>
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
      