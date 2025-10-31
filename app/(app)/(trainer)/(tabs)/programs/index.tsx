import { View, Text } from '@/components/Themed';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getPrograms } from '@/lib/api';
import { YStack, H3 } from 'tamagui';
import { FlashList } from '@shopify/flash-list';
import { Card } from '@/components/ui/Card';

type Program = { id: string, name: string, description: string };

export default function ProgramsScreen() {
    const { data: programs, isLoading } = useQuery({ queryKey: ['programs'], queryFn: getPrograms });

    if (isLoading) {
        return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>
    }

    const renderItem = ({ item }: { item: Program }) => (
        <Card padding="$4" marginVertical="$2">
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text>{item.description}</Text>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" paddingHorizontal="$4" flex={1}>
                <H3>My Programs</H3>
                <FlashList
                    data={programs}
                    renderItem={renderItem}
                    estimatedItemSize={80}
                    ListEmptyComponent={<Text>No programs created yet.</Text>}
                />
            </YStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
      