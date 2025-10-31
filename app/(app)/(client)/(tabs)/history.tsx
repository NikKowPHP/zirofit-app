import { View, Text } from '@/components/Themed';
import { ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, H3 } from 'tamagui';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'expo-router';

const fetchHistory = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Array.from({ length: 20 }, (_, i) => ({
        id: `sess_${i}`,
        name: `Workout ${20 - i}`,
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toDateString(),
    }));
};

type Session = { id: string, name: string, date: string };

export default function HistoryScreen() {
    const router = useRouter();
    const { data, isLoading } = useQuery({ queryKey: ['history'], queryFn: fetchHistory });

    const renderItem = ({ item }: { item: Session }) => (
        <Pressable onPress={() => router.push(`/session/${item.id}`)}>
            <Card padding="$4" marginVertical="$2">
                <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
                <Text>{item.date}</Text>
            </Card>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" paddingHorizontal="$4" flex={1}>
                <H3>History</H3>
                {isLoading ? (
                    <View style={styles.center}><ActivityIndicator /></View>
                ) : (
                    <FlashList
                        data={data}
                        renderItem={renderItem}
                        estimatedItemSize={75}
                    />
                )}
            </YStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
      