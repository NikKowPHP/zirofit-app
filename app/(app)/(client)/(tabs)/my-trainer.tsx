import { View, Text } from '@/components/Themed';
import { StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H3, YStack, Avatar } from 'tamagui';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import * as WebBrowser from 'expo-web-browser';
import { createCheckoutSession, getMyTrainer } from '@/lib/api';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import FindTrainerPrompt from '@/components/dashboard/FindTrainerPrompt';

export default function MyTrainerScreen() {
    const [loading, setLoading] = useState(false);
    const { data: trainer, isLoading } = useQuery({ queryKey: ['myTrainer'], queryFn: getMyTrainer });

    const handleBuyPackage = async () => {
        setLoading(true);
        try {
            const { url } = await createCheckoutSession('pro_package'); // Example package ID
            if (url) {
                await WebBrowser.openBrowserAsync(url);
            } else {
                Alert.alert('Error', 'Could not initiate checkout session.');
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
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

                        <Card padding="$4" alignItems='center' width="100%">
                            <H3>Training Packages</H3>
                            <Text mt="$2" textAlign='center'>Get a personalized plan and 1-on-1 support.</Text>
                            <Button 
                                mt="$4" 
                                theme="green" 
                                onPress={handleBuyPackage} 
                                disabled={loading}>
                                {loading ? 'Processing...' : 'Buy Package'}
                            </Button>
                        </Card>
                    </>
                ) : (
                    <FindTrainerPrompt />
                )}
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
    }
});
      