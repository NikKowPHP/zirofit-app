import { View, Text } from '@/components/Themed';
import { StyleSheet, ActivityIndicator, FlatList, Pressable } from 'react-native';
import { YStack, H3, H5 } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import useWorkoutStore from '@/store/workoutStore';
import { Button } from '@/components/ui/Button';
import ActiveExerciseCard from '@/components/workout/ActiveExerciseCard';
import InlineRestTimer from '@/components/workout/InlineRestTimer';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWorkoutTemplates } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';

export default function LogWorkoutScreen() {
    const { 
        workoutSession, 
        startWorkout, 
        finishWorkout, 
        isResting, 
        restTimerValue,
        isLoading,
        checkActiveSession,
        stopResting,
    } = useWorkoutStore();
    const [templateModalVisible, setTemplateModalVisible] = useState(false);

    const { data: templates, isLoading: templatesLoading } = useQuery({
      queryKey: ['workoutTemplates'],
      queryFn: getWorkoutTemplates,
      enabled: !workoutSession, // Only fetch if no session is active
    });

    useEffect(() => {
        // Check for an active session when the screen loads
        checkActiveSession();
    }, []);

    const handleSelectTemplate = (templateId: string) => {
        startWorkout(templateId);
        setTemplateModalVisible(false);
    }

    if (isLoading) {
        return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" padding="$4" flex={1}>
                <H3>{workoutSession ? workoutSession.name : 'Log Workout'}</H3>

                {isResting && <InlineRestTimer duration={restTimerValue} onFinish={stopResting} />}

                {workoutSession ? (
                    <>
                        <FlatList
                            data={workoutSession.exercises}
                            renderItem={({ item }) => (
                                <ActiveExerciseCard 
                                    exercise={item} 
                                    loggedSets={workoutSession.logs?.filter(log => log.exercise_id === item.id) || []}
                                />
                            )}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={() => <View style={{height: 10}} />}
                        />
                        <View style={{flex: 1}} />
                        <Button theme="red" onPress={finishWorkout}>Finish Workout</Button>
                    </>
                ) : (
                    <View style={styles.center}>
                        <H5>Start a new session</H5>
                        <YStack space="$3" width="80%" mt="$4">
                            <Button onPress={() => startWorkout('blank')}>Start Blank Workout</Button>
                            <Button onPress={() => setTemplateModalVisible(true)} disabled={templatesLoading}>
                                {templatesLoading ? 'Loading Templates...' : 'Start from Template'}
                            </Button>
                        </YStack>
                    </View>
                )}
            </YStack>

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
                            <Card padding="$3" marginVertical="$2">
                                <Text>{item.name}</Text>
                            </Card>
                        </Pressable>
                    )}
                    ListEmptyComponent={<Text>No templates found.</Text>}
                />
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
      