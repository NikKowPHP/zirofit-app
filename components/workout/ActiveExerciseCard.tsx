import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { YStack, H5, XStack, Text } from 'tamagui';
import { useState } from 'react';
import useWorkoutStore from '@/store/workoutStore';
import { View } from 'react-native';

export default function ActiveExerciseCard({ exercise, loggedSets }: { exercise: any, loggedSets: any[] }) {
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const { logSet, workoutSession } = useWorkoutStore();

    const handleLogSet = () => {
        if (!reps || !weight || !workoutSession) return;
        logSet({
            reps: parseInt(reps),
            weight: parseFloat(weight),
            exercise_id: exercise.id,
        });
        setReps('');
        setWeight('');
    }

    return (
        <Card padding="$4">
            <YStack space="$3">
                <H5>{exercise.name}</H5>
                
                <View>
                    {loggedSets.map((set, index) => (
                        <XStack key={set.id || `set-${index}`} justifyContent="space-between">
                            <Text>Set {index + 1}</Text>
                            <Text>{set.reps} reps</Text>
                            <Text>{set.weight} kg</Text>
                        </XStack>
                    ))}
                </View>

                <XStack space="$2" alignItems="center">
                    <Input placeholder="Reps" keyboardType="numeric" value={reps} onChangeText={setReps} flex={1} />
                    <Input placeholder="Weight" keyboardType="numeric" value={weight} onChangeText={setWeight} flex={1} />
                </XStack>
                <Button onPress={handleLogSet}>Save & Rest</Button>
            </YStack>
        </Card>
    );
}
      