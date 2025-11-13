import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { VStack, HStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { useTokens } from '@/hooks/useTheme';
import { useState } from 'react';
import useWorkoutStore from '@/store/workoutStore';
import { View } from 'react-native';

export default function ActiveExerciseCard({ exercise, loggedSets }: { exercise: any, loggedSets: any[] }) {
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const { logSet, workoutSession } = useWorkoutStore();
    const tokens = useTokens();

    const handleLogSet = () => {
        if (!reps || !weight || !workoutSession) return;
        logSet({
            client_id: '', // Will be set by API
            exercise_id: exercise.id,
            sets: [{ reps: parseInt(reps), weight: parseFloat(weight) }],
            completed_at: new Date().toISOString(),
        });
        setReps('');
        setWeight('');
    }

    return (
        <Card>
            <VStack style={{ gap: tokens.spacing.md }}>
                <UIText variant="h5">{exercise.name}</UIText>
                
                <View>
                    {loggedSets.map((set, index) => (
                        <HStack key={set.id || `set-${index}`} style={{ justifyContent: 'space-between' }}>
                            <UIText variant="body">Set {index + 1}</UIText>
                            <UIText variant="body">{set.reps} reps</UIText>
                            <UIText variant="body">{set.weight} kg</UIText>
                        </HStack>
                    ))}
                </View>

                <HStack style={{ gap: tokens.spacing.sm, alignItems: 'center' }}>
                    <Input placeholder="Reps" keyboardType="numeric" value={reps} onChangeText={setReps} style={{ flex: 1 }} />
                    <Input placeholder="Weight" keyboardType="numeric" value={weight} onChangeText={setWeight} style={{ flex: 1 }} />
                </HStack>
                <Button onPress={handleLogSet}>Save & Rest</Button>
            </VStack>
        </Card>
    );
}
      