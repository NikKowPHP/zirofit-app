import { View, Text } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { YStack } from 'tamagui';

export default function CreateClientScreen() {
    const [email, setEmail] = useState('');
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
        if (!email) {
            Alert.alert('Error', 'Please enter an email address.');
            return;
        }
        mutation.mutate(email);
    };

    return (
        <View style={styles.container}>
            <YStack space="$4" width="90%">
                <Text>Enter the email address of the client you want to invite. They will receive an email to sign up and connect with you.</Text>
                <Input
                    placeholder="client@example.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Button onPress={handleInvite} disabled={mutation.isPending}>
                    {mutation.isPending ? 'Sending Invitation...' : 'Invite Client'}
                </Button>
            </YStack>
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
      