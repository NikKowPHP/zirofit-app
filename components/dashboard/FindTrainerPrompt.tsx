import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { VStack } from '@/components/ui/Stack';
import { Text } from '@/components/ui/Text';

export default function FindTrainerPrompt() {
    return (
        <Card>
            <VStack style={{ gap: 12, alignItems: 'center' }}>
                <Text variant="h5">Find a Trainer</Text>
                <Text variant="body">Get personalized workout plans and guidance.</Text>
                <Button>Browse Trainers</Button>
            </VStack>
        </Card>
    );
}
      