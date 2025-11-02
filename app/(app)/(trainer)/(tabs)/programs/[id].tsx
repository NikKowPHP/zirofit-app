import { View, Text } from '@/components/Themed';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, FlatList, StyleSheet, Alert, Pressable } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { H3, YStack, XStack } from 'tamagui';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Exercise = { id: string; name: string };
type TemplateExercise = { id: string; name: string; pivot?: { notes: string } };

export default function TemplateEditorScreen() {
    const { id } = useLocalSearchParams();
    const templateId = id as string;
    const queryClient = useQueryClient();

    const { data: template, isLoading, error } = useQuery({
        queryKey: ['template', templateId],
        queryFn: () => api.getTemplateDetails(templateId),
        enabled: !!templateId,
    });

    const { data: allExercises } = useQuery({
        queryKey: ['exercises'],
        queryFn: api.getAvailableExercises,
    });

    const [isAddExerciseModalVisible, setAddExerciseModalVisible] = useState(false);

    const addExerciseMutation = useMutation({
        mutationFn: (exerciseId: string) => api.addExerciseToTemplate(templateId, { exercise_id: exerciseId }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['template', templateId] }),
        onError: (e: any) => Alert.alert('Error', e.message),
    });

    const removeExerciseMutation = useMutation({
        mutationFn: (exerciseId: string) => api.removeExerciseFromTemplate(templateId, exerciseId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['template', templateId] }),
        onError: (e: any) => Alert.alert('Error', e.message),
    });


    if (isLoading) return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>;
    if (error) return <SafeAreaView style={styles.center}><Text>Error fetching template details.</Text></SafeAreaView>;

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: template?.name || `Template ${id}` }} />
            <YStack space="$4" padding="$4" flex={1}>
                <FlatList
                    data={template.exercises}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Card padding="$3" marginVertical="$2">
                            <XStack justifyContent='space-between' alignItems='center'>
                                <Text style={styles.exerciseName}>{item.name}</Text>
                                <Pressable onPress={() => removeExerciseMutation.mutate(item.id)}>
                                    <FontAwesome name="trash" size={20} color="red" />
                                </Pressable>
                            </XStack>
                        </Card>
                    )}
                    ListHeaderComponent={<Button onPress={() => setAddExerciseModalVisible(true)}>Add Exercise</Button>}
                    ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>No exercises added yet.</Text>}
                />
            </YStack>

            <Modal visible={isAddExerciseModalVisible} onClose={() => setAddExerciseModalVisible(false)} title="Add Exercise">
                <FlatList
                    data={allExercises?.filter((ex: Exercise) => !template.exercises.some((te: TemplateExercise) => te.id === ex.id))}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => {
                            addExerciseMutation.mutate(item.id);
                            setAddExerciseModalVisible(false);
                        }}>
                             <Card padding="$3" marginVertical="$2">
                                <Text>{item.name}</Text>
                            </Card>
                        </Pressable>
                    )}
                />
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center'},
    exerciseName: { fontSize: 16, fontWeight: '500' }
});
      