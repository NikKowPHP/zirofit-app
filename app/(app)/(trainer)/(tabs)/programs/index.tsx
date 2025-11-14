import { View, Text } from '@/components/Themed';
import { StyleSheet, ActivityIndicator, Pressable, Alert, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { createProgram } from '@/lib/api';
import { VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { useTokens } from '@/hooks/useTheme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import type { TrainerProgram } from '@/lib/api.types';
import type { CreateProgramRequest } from '@/lib/api/types/request';
import { trainerProgramRepository } from '@/lib/repositories/trainerProgramRepository';
import withObservables from '@nozbe/with-observables';

// Constants
const ERROR_MESSAGES = {
  CREATE_FAILED: 'Failed to create program. Please try again.',
} as const;

type Program = TrainerProgram;
type Template = { id: string, name: string };

function ProgramsScreen({ programs }: { programs: any[] }) {
    const router = useRouter();
    const tokens = useTokens();

    const [modalVisible, setModalVisible] = useState(false);
    const [programName, setProgramName] = useState('');
    const [programDesc, setProgramDesc] = useState('');
    const [expandedProgram, setExpandedProgram] = useState<string | null>(null);

    const createProgramMutation = useMutation({
        mutationFn: createProgram,
        onSuccess: () => {
            Alert.alert('Success', 'Program created!');
            setModalVisible(false);
            setProgramName('');
            setProgramDesc('');
        },
        onError: (e: any) => Alert.alert('Error', e.message || ERROR_MESSAGES.CREATE_FAILED),
    });

    const handleCreateProgram = useCallback(async () => {
        if (!programName.trim()) {
            Alert.alert('Error', 'Please enter a program name.');
            return;
        }

        try {
            // Create locally first for optimistic update
            await trainerProgramRepository.createTrainerProgram({
                trainerId: 'current-trainer-id', // TODO: get from auth
                name: programName.trim(),
                description: programDesc.trim() || undefined,
                isActive: true
            });

            // Then sync to server
            await createProgramMutation.mutateAsync({
                name: programName.trim(),
                description: programDesc.trim() || undefined,
            } as any);
        } catch (error) {
            Alert.alert('Error', 'Failed to create program');
        }
    }, [programName, programDesc, createProgramMutation]);

    const renderItem = ({ item }: { item: any }) => (
        <Card style={{ marginVertical: tokens.spacing.sm }}>
            <TouchableOpacity onPress={() => setExpandedProgram(expandedProgram === item.id ? null : item.id)}>
                <VStack style={{ padding: tokens.spacing.md, flex: 1 }}>
                    <UIText variant="h5">{item.name}</UIText>
                    <Text>{item.description || 'No description'}</Text>
                </VStack>
            </TouchableOpacity>
            {expandedProgram === item.id && (
                <VStack style={{ padding: tokens.spacing.md, borderTopWidth: 1, borderTopColor: tokens.colors.light.border }}>
                    {/* TODO: Add templates when template repository is available */}
                    <Text style={styles.templateName}>Templates will be shown here</Text>
                </VStack>
            )}
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <VStack style={{ gap: tokens.spacing.lg, paddingHorizontal: tokens.spacing.lg, flex: 1 }}>
                <Button onPress={() => setModalVisible(true)}>Create New Program</Button>
                <FlatList
                    data={programs}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={<Text>No programs created yet.</Text>}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </VStack>

            <Modal visible={modalVisible} onClose={() => setModalVisible(false)} title="Create Program">
                <VStack style={{ gap: tokens.spacing.md }}>
                    <Input placeholder="Program Name" value={programName} onChangeText={setProgramName} />
                    <Input placeholder="Description (optional)" value={programDesc} onChangeText={setProgramDesc} />
                    <Button onPress={handleCreateProgram} disabled={createProgramMutation.isPending}>
                        {createProgramMutation.isPending ? 'Creating...' : 'Create Program'}
                    </Button>
                </VStack>
            </Modal>
        </SafeAreaView>
    );
}

const enhance = withObservables([], () => ({
  programs: trainerProgramRepository.observeTrainerPrograms(),
}));

export default enhance(ProgramsScreen);

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    templateName: { fontSize: 14, color: 'gray' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});