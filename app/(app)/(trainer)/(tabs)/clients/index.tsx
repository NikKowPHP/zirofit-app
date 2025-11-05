import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, H3, XStack, Avatar } from 'tamagui';
import { getClients } from '@/lib/api';
import { useRouter, useNavigation } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useLayoutEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { Client } from '@/lib/api.types';

export default function ClientsScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const { data, isLoading } = useQuery({ queryKey: ['clients'], queryFn: getClients });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={() => router.push('/(app)/(trainer)/(tabs)/clients/create')}>
                    <FontAwesome name="plus" size={20} style={{ marginRight: 15 }} />
                </Pressable>
            ),
        });
    }, [navigation, router]);

    const renderItem = ({ item }: { item: Client }) => (
        <Pressable onPress={() => router.push(`/client/${item.id}`)}>
            <Card padding="$3" marginVertical="$2">
                <XStack space="$3" alignItems="center">
                    <Avatar circular size="$4">
                        <Avatar.Image src={item.avatar_url || undefined} />
                        <Avatar.Fallback bc="gray" />
                    </Avatar>
                    <Text style={{fontSize: 16}}>{item.name}</Text>
                </XStack>
            </Card>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" paddingHorizontal="$4" flex={1}>
                {isLoading ? (
                    <View style={styles.center}><ActivityIndicator /></View>
                ) : (
                    <FlashList
                        data={data}
                        renderItem={renderItem}
                        estimatedItemSize={70}
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
      