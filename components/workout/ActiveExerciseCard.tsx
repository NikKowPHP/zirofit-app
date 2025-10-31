import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { YStack, H5, XStack, Text } from 'tamagui';
import { useState } from 'react';
import useWorkoutStore from '@/store/workoutStore';

export default function ActiveExerciseCard({ exercise }: { exercise: any }) {
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const { logSetOptimistic, workoutSession } = useWorkoutStore();

    const handleLogSet = () => {
        if (!reps || !weight || !workoutSession) return;
        logSetOptimistic({
            reps: parseInt(reps),
            weight: parseFloat(weight),
            exercise_id: exercise.id,
            workout_session_id: workoutSession.id
        });
        setReps('');
        setWeight('');
    }

    return (
        <Card padding="$4">
            <YStack space="$3">
                <H5>{exercise.name}</H5>
                {/* Here you'd list previously logged sets for this exercise */}
                <XStack space="$2" alignItems="center">
                    <Input placeholder="Reps" keyboardType="numeric" value={reps} onChangeText={setReps} flex={1} />
                    <Input placeholder="Weight" keyboardType="numeric" value={weight} onChangeText={setWeight} flex={1} />
                </XStack>
                <Button onPress={handleLogSet}>Save & Rest</Button>
            </YStack>
        </Card>
    );
}
      