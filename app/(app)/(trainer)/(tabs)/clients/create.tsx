import { View, Text } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { VStack } from '@/components/ui/Stack';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { clientRepository } from '@/lib/repositories/clientRepository';
import useAuthStore from '@/store/authStore';

export default function CreateClientScreen() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const user = useAuthStore(state => state.user);

    const handleInvite = async () => {
        if (!email || !name || !phone) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (!user?.id) {
            Alert.alert('Error', 'You must be logged in to create a client.');
            return;
        }

        setIsLoading(true);
        try {
            await clientRepository.createClient({
                name,
                email,
                phone,
                trainerId: user.id,
            });
            Alert.alert('Success', 'Client has been created.');
            router.back();
        } catch (error) {
            console.error('Error creating client:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create client.';
            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <VStack style={{ gap: 16, width: '90%' }}>
                <Text>Enter the details of the client you want to invite. They will receive an email to sign up and connect with you.</Text>
                <Input
                    placeholder="Client Name"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                />
                <Input
                    placeholder="client@example.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Input
                    placeholder="Phone Number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
                <Button onPress={handleInvite} disabled={isLoading}>
                    {isLoading ? 'Creating Client...' : 'Create Client'}
                </Button>
            </VStack>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
        paddingTop: 30,
    }
});
      