import { View, Text } from '@/components/Themed';
import { StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPrograms, createProgram } from '@/lib/api';
import { YStack, H3, H5, Accordion } from 'tamagui';
import { FlashList } from '@shopify/flash-list';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import type { TrainerProgram } from '@/lib/api.types';
import type { CreateProgramRequest } from '@/lib/api/types/request';

type Program = TrainerProgram;
type Template = { id: string, name: string };

export default function ProgramsScreen() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: programs, isLoading } = useQuery({ queryKey: ['programs'], queryFn: getPrograms });

    const [modalVisible, setModalVisible] = useState(false);
    const [programName, setProgramName] = useState('');
    const [programDesc, setProgramDesc] = useState('');

    const createProgramMutation = useMutation({
        mutationFn: createProgram,
        onSuccess: () => {
            Alert.alert('Success', 'Program created!');
            queryClient.invalidateQueries({ queryKey: ['programs'] });
            setModalVisible(false);
            setProgramName('');
            setProgramDesc('');
        },
        onError: (e: any) => Alert.alert('Error', e.message),
    });

    const handleCreateProgram = () => {
        if (!programName) {
            Alert.alert('Error', 'Please enter a program name.');
            return;
        }
        createProgramMutation.mutate({ name: programName, description: programDesc });
    }

    const renderItem = ({ item }: { item: Program }) => (
        <Card padding="$0" marginVertical="$2">
            <Accordion type="single" collapsible>
                <Accordion.Item value={item.id}>
                    <Accordion.Trigger>
                        <YStack padding="$3" flex={1}>
                            <H5>{item.name}</H5>
                            <Text>{item.description || 'No description'}</Text>
                        </YStack>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <YStack padding="$3" borderTopWidth={1} borderColor="$borderColor">
                            {item.templates?.map(template => (
                                <Pressable key={template.id} onPress={() => router.push(`/(app)/(trainer)/(tabs)/programs/${template.id}`)}>
                                    <Text style={styles.templateName}>{template.name}</Text>
                                </Pressable>
                            ))}
                            {/* In a real app, would add a "Create Template" button here */}
                        </YStack>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
        </Card>
    );

    if (isLoading) {
        return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>
    }

    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" paddingHorizontal="$4" flex={1}>
                <Button onPress={() => setModalVisible(true)}>Create New Program</Button>
                <FlashList
                    data={programs}
                    renderItem={renderItem}
                    estimatedItemSize={100}
                    ListEmptyComponent={<Text>No programs created yet.</Text>}
                />
            </YStack>

            <Modal visible={modalVisible} onClose={() => setModalVisible(false)} title="Create Program">
                <YStack space="$3">
                    <Input placeholder="Program Name" value={programName} onChangeText={setProgramName} />
                    <Input placeholder="Description (optional)" value={programDesc} onChangeText={setProgramDesc} />
                    <Button onPress={handleCreateProgram} disabled={createProgramMutation.isPending}>
                        {createProgramMutation.isPending ? 'Creating...' : 'Create Program'}
                    </Button>
                </YStack>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    templateName: { fontSize: 14, color: 'gray' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});