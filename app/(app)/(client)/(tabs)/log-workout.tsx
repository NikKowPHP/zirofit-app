import { View, Text } from '@/components/Themed';
import { StyleSheet } from 'react-native';
import { YStack, H3 } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import useWorkoutStore from '@/store/workoutStore';
import { Button } from '@/components/ui/Button';
import ActiveExerciseCard from '@/components/workout/ActiveExerciseCard';
import InlineRestTimer from '@/components/workout/InlineRestTimer';

export default function LogWorkoutScreen() {
    const { workoutSession, startWorkout, finishWorkout, isResting } = useWorkoutStore();

    const handleStartWorkout = () => {
        // In a real app, you'd select a template or session
        const mockSession = { id: 'session123', name: 'Push Day', exercises: [{ id: 'ex1', name: 'Bench Press'}] };
        startWorkout(mockSession);
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" padding="$4" flex={1}>
                <H3>{workoutSession ? workoutSession.name : 'Log Workout'}</H3>

                {isResting && <InlineRestTimer duration={60} />}

                {workoutSession ? (
                    <>
                        <ActiveExerciseCard exercise={workoutSession.exercises[0]} />
                        {/* Add a list of exercises here */}
                        <View style={{flex: 1}} />
                        <Button theme="red" onPress={finishWorkout}>Finish Workout</Button>
                    </>
                ) : (
                    <View style={styles.center}>
                        <Text style={{ marginBottom: 20 }}>Select a template or start a new workout.</Text>
                        <Button onPress={handleStartWorkout}>Quick Start</Button>
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
      