import { View, Text } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { VStack } from '@/components/ui/Stack';
import { createClient } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

export default function CreateClientScreen() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createClient,
        onSuccess: () => {
            Alert.alert('Success', 'Client has been invited.');
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            router.back();
        },
        onError: (error: any) => {
            Alert.alert('Error', error.message || 'Failed to invite client.');
        }
    });

    const handleInvite = () => {
        if (!email || !name || !phone) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        mutation.mutate({ email, name, phone });
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
                <Button onPress={handleInvite} disabled={mutation.isPending}>
                    {mutation.isPending ? 'Sending Invitation...' : 'Invite Client'}
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
      