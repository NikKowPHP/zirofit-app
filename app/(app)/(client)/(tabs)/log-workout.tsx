import { View, Text } from '@/components/Themed';
import { StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { YStack, H3 } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import useWorkoutStore from '@/store/workoutStore';
import { Button } from '@/components/ui/Button';
import ActiveExerciseCard from '@/components/workout/ActiveExerciseCard';
import InlineRestTimer from '@/components/workout/InlineRestTimer';
import { useEffect } from 'react';

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

    useEffect(() => {
        // Check for an active session when the screen loads
        checkActiveSession();
    }, []);

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
                        <Text style={{ marginBottom: 20 }}>Select a template or start a new workout.</Text>
                        <Button onPress={() => startWorkout('some_template_id')}>Quick Start</Button>
                    </View>
                )}
            </YStack>
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
      