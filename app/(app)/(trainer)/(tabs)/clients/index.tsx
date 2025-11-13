import { ActivityIndicator, Pressable, StyleSheet, FlatList, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack, HStack } from '@/components/ui/Stack';
import { getClients } from '@/lib/api';
import { useRouter, useNavigation } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useLayoutEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { Client } from '@/lib/api.types';
import { useTokens } from '@/hooks/useTheme';

export default function ClientsScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const tokens = useTokens();
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
            <Card style={{ padding: tokens.spacing.md, marginVertical: tokens.spacing.sm }}>
                <HStack style={{ gap: tokens.spacing.md, alignItems: 'center' }}>
                    <View style={styles.avatarContainer}>
                        <Image 
                            source={{ uri: item.avatar_url }} 
                            style={styles.avatar} 
                            defaultSource={require('@/assets/images/icon.png')}
                        />
                    </View>
                    <Text style={{fontSize: 16}}>{item.name}</Text>
                </HStack>
            </Card>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <VStack style={{ paddingHorizontal: tokens.spacing.lg, gap: tokens.spacing.lg, flex: 1 }}>
                {isLoading ? (
                    <View style={styles.center}><ActivityIndicator /></View>
                ) : (
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />
                )}
            </VStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    avatarContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#e0e0e0',
    },
    avatar: {
        width: '100%',
        height: '100%',
    }
});
      