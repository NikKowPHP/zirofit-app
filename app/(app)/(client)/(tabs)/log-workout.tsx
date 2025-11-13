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
import { useQuery } from '@tanstack/react-query';
import { getWorkoutTemplates, getAvailableExercises } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';

export default function LogWorkoutScreen() {
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

    const { data: templates, isLoading: templatesLoading } = useQuery({
      queryKey: ['workoutTemplates'],
      queryFn: getWorkoutTemplates,
      enabled: !workoutSession, // Only fetch if no session is active
    });

    const { data: exercises, isLoading: exercisesLoading } = useQuery({
      queryKey: ['availableExercises'],
      queryFn: getAvailableExercises,
      enabled: !!workoutSession, // Only fetch if there's an active session
    });

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
                        <Button onPress={() => setExerciseModalVisible(true)} disabled={exercisesLoading} style={{ marginBottom: 16 }}>
                            {exercisesLoading ? 'Loading Exercises...' : 'Add Exercise'}
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
                                <Button onPress={() => startWorkout('blank')}>Start Blank Workout</Button>
                                <Button onPress={() => setTemplateModalVisible(true)} disabled={templatesLoading}>
                                    {templatesLoading ? 'Loading Templates...' : 'Start from Template'}
                                </Button>
                            </VStack>
                        </Card>
                    </View>
                )}
            </Screen>

            <Modal
                visible={templateModalVisible}
                onClose={() => setTemplateModalVisible(false)}
                title="Select a Template"
            >
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

            <Modal
                visible={exerciseModalVisible}
                onClose={() => setExerciseModalVisible(false)}
                title="Select an Exercise"
            >
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
        </>
    )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
      