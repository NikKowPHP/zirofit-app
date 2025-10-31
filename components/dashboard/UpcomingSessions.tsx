import { Card } from '@/components/ui/Card';
import { YStack, H5, Text } from 'tamagui';

type Session = { id: string; time: string; trainer: string };

export default function UpcomingSessions({ sessions }: { sessions: Session[] }) {
    return (
        <Card padding="$4">
            <YStack space="$2">
                <H5>Upcoming Session</H5>
                {sessions.map(s => (
                    <Text key={s.id}>{s.time} with {s.trainer}</Text>
                ))}
            </YStack>
        </Card>
    );
}
      