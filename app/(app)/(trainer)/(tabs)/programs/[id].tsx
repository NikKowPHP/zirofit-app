import { View, Text } from '@/components/Themed';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, FlatList, StyleSheet, Alert, Pressable } from 'react-native';
import { VStack, HStack } from '@/components/ui/Stack';
import { useTokens } from '@/hooks/useTheme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { withObservables } from '@nozbe/watermelondb/react';
import { workoutTemplateRepository, exerciseRepository } from '@/lib/repositories';
import WorkoutTemplate from '@/lib/db/models/WorkoutTemplate';
import Exercise from '@/lib/db/models/Exercise';
import React from 'react';

type TemplateExercise = { id: string; name: string; pivot?: { notes: string } };

interface TemplateEditorScreenProps {
  template: WorkoutTemplate;
  templateExercises: any[];
  allExercises: Exercise[];
}

function TemplateEditorScreen({ template, templateExercises, allExercises }: TemplateEditorScreenProps) {
    const tokens = useTokens();

    const [isAddExerciseModalVisible, setAddExerciseModalVisible] = useState(false);

    const handleAddExercise = async (exerciseId: string) => {
        try {
            await workoutTemplateRepository.addExerciseToTemplate(template.id, exerciseId);
            setAddExerciseModalVisible(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to add exercise to template');
        }
    };

    const handleRemoveExercise = async (exerciseId: string) => {
        try {
            await workoutTemplateRepository.removeExerciseFromTemplate(template.id, exerciseId);
        } catch (error) {
            Alert.alert('Error', 'Failed to remove exercise from template');
        }
    };

    if (!template) return <SafeAreaView style={styles.center}><Text>Template not found.</Text></SafeAreaView>;

    // Transform templateExercises to match the expected format
    const exercises = templateExercises.map(te => ({
        id: te.exerciseId,
        name: allExercises.find(e => e.id === te.exerciseId)?.name || 'Unknown Exercise',
        pivot: { notes: te.notes }
    }));

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: template?.name || `Template` }} />
            <VStack style={{ gap: tokens.spacing.lg, padding: tokens.spacing.lg, flex: 1 }}>
                <FlatList
                    data={exercises}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Card style={{ marginVertical: tokens.spacing.sm }}>
                            <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.exerciseName}>{item.name}</Text>
                                <Pressable onPress={() => handleRemoveExercise(item.id)}>
                                    <FontAwesome name="trash" size={20} color="red" />
                                </Pressable>
                            </HStack>
                        </Card>
                    )}
                    ListHeaderComponent={<Button onPress={() => setAddExerciseModalVisible(true)}>Add Exercise</Button>}
                    ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>No exercises added yet.</Text>}
                />
            </VStack>

            <Modal visible={isAddExerciseModalVisible} onClose={() => setAddExerciseModalVisible(false)} title="Add Exercise">
                <FlatList
                    data={allExercises?.filter((ex: Exercise) => !exercises.some((te: TemplateExercise) => te.id === ex.id))}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => handleAddExercise(item.id)}>
                             <Card style={{ marginVertical: tokens.spacing.sm }}>
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

// Wrap component with withObservables for reactive data
const enhance = (WrappedComponent: React.ComponentType<any>) => {
    return (props: any) => {
        const { id } = useLocalSearchParams();
        const templateId = id as string;

        const EnhancedComponent = withObservables([], () => ({
            template: workoutTemplateRepository.observeWorkoutTemplate(templateId),
            templateExercises: workoutTemplateRepository.observeTemplateExercises(templateId),
            allExercises: exerciseRepository.observeExercises(),
        }))(WrappedComponent);

        return <EnhancedComponent {...props} templateId={templateId} />;
    };
};

export default enhance(TemplateEditorScreen);