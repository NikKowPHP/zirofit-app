import { View, Text } from '@/components/Themed';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H3, YStack, Avatar } from 'tamagui';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import * as WebBrowser from 'expo-web-browser';
import { createCheckoutSession } from '@/lib/api';
import { useState } from 'react';

export default function MyTrainerScreen() {
    const [loading, setLoading] = useState(false);

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

    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" padding="$4" alignItems='center'>
                <H3>My Trainer</H3>
                <Card padding="$4" alignItems='center' width="100%">
                    <Avatar circular size="$10">
                        <Avatar.Image src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                        <Avatar.Fallback bc="blue" />
                    </Avatar>
                    <H3 mt="$2">Jane Doe</H3>
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
            </YStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
});
      