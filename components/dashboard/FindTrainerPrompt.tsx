import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { YStack, H5, Text } from 'tamagui';

export default function FindTrainerPrompt() {
    return (
        <Card padding="$4">
            <YStack space="$3" alignItems='center'>
                <H5>Find a Trainer</H5>
                <Text>Get personalized workout plans and guidance.</Text>
                <Button>Browse Trainers</Button>
            </YStack>
        </Card>
    );
}
      