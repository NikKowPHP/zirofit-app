import { Card } from '@/components/ui/Card';
import { VStack } from '@/components/ui/Stack';
import { Text } from '@/components/ui/Text';

type Session = { id: string; time: string; trainer: string };

export default function UpcomingSessions({ sessions }: { sessions: Session[] }) {
    return (
        <Card>
            <VStack style={{ gap: 8 }}>
                <Text variant="h5">Upcoming Session</Text>
                {sessions.map(s => (
                    <Text key={s.id} variant="body">{s.time} with {s.trainer}</Text>
                ))}
            </VStack>
        </Card>
    );
}
      