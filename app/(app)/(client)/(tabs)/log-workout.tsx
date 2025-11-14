import { View, Text } from '@/components/Themed';
import { StyleSheet, ActivityIndicator, FlatList, Pressable } from 'react-native';
import { VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { Screen } from '@/components/ui/Screen';
import useWorkoutStore from '@/store/workoutStore';
import { Button } from '@/components/ui/Button';
import ActiveExerciseCard from '@/components/workout/ActiveExerciseCard';
import InlineRestTimer from '@/components/workout/InlineRestTimer';
import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { workoutTemplateRepository } from '@/lib/repositories/workoutTemplateRepository';
import { exerciseRepository } from '@/lib/repositories/exerciseRepository';
import withObservables from '@nozbe/with-observables';

function LogWorkoutScreen({ templates, exercises }: { templates: any[], exercises: any[] }) {
    const {
        workoutSession,
        startWorkout,
        finishWorkout,
        addExercise,
        isResting,
        restTimerValue,
        isLoading,
        checkActiveSession,
        stopResting,
    } = useWorkoutStore();
    const [templateModalVisible, setTemplateModalVisible] = useState(false);
    const [exerciseModalVisible, setExerciseModalVisible] = useState(false);

    useEffect(() => {
        // Check for an active session when the screen loads
        checkActiveSession();
    }, []);

    const handleSelectTemplate = (templateId: string) => {
        startWorkout(templateId);
        setTemplateModalVisible(false);
    }

    const handleSelectExercise = (exerciseId: string) => {
        addExercise(exerciseId);
        setExerciseModalVisible(false);
    }

    const renderExerciseModal = () => (
        <Modal visible={exerciseModalVisible} onClose={() => setExerciseModalVisible(false)} title="Select Exercise">
            <FlatList
                data={exercises}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable onPress={() => handleSelectExercise(item.id)}>
                        <Card style={{ padding: 12, marginVertical: 8 }}>
                            <Text>{item.name}</Text>
                        </Card>
                    </Pressable>
                )}
                ListEmptyComponent={<Text>No exercises found.</Text>}
            />
        </Modal>
    )

    const renderTemplateModal = () => (
        <Modal visible={templateModalVisible} onClose={() => setTemplateModalVisible(false)} title="Select Workout Template">
            <FlatList
                data={templates}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable onPress={() => handleSelectTemplate(item.id)}>
                        <Card style={{ padding: 12, marginVertical: 8 }}>
                            <Text>{item.name}</Text>
                        </Card>
                    </Pressable>
                )}
                ListEmptyComponent={<Text>No templates found.</Text>}
            />
        </Modal>
    )

    if (isLoading) {
        return <Screen center><ActivityIndicator /></Screen>
    }
    
    return (
        <>
            <Screen>
                <UIText variant="h3">{workoutSession?.name || 'Log Workout'}</UIText>

                {isResting && <InlineRestTimer duration={restTimerValue} onFinish={stopResting} />}

                {workoutSession ? (
                    <>
                        <Button onPress={() => setExerciseModalVisible(true)} style={{ marginBottom: 16 }}>
                            Add Exercise
                        </Button>
                        <FlatList
                            data={workoutSession.exercises || []}
                            renderItem={({ item }) => (
                                <ActiveExerciseCard 
                                    exercise={item} 
                                    loggedSets={(workoutSession?.logs || []).filter((log: any) => log.exercise_id === item.id).flatMap((log: any) => log.sets) || []}
                                />
                            )}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={() => <View style={{height: 10}} />}
                        />
                        <View style={{flex: 1}} />
                        <Button style={{ marginTop: 16 }} variant="danger" onPress={finishWorkout}>
                            Finish Workout
                        </Button>
                    </>
                ) : (
                    <View style={styles.center}>
                        <Card style={{ padding: 16 }}>
                            <VStack style={{ gap: 12 }}>
                                <UIText variant="h5">No active workout session.</UIText>
                                <Button onPress={() => startWorkout()}>Start Blank Workout</Button>
                                <Button onPress={() => setTemplateModalVisible(true)}>
                                    Start from Template
                                </Button>
                            </VStack>
                        </Card>
                    </View>
                )}
            </Screen>

            {renderExerciseModal()}
            {renderTemplateModal()}
        </>
    )
}

const enhance = withObservables([], () => ({
  templates: workoutTemplateRepository.observeWorkoutTemplates(),
  exercises: exerciseRepository.observeExercises(),
}));

export default enhance(LogWorkoutScreen);

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
      