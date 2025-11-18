import { ActivityIndicator, Pressable, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack, HStack } from '@/components/ui/Stack';
import { useRouter, useNavigation } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useLayoutEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { Client } from '@/lib/api.types';
import { useTokens } from '@/hooks/useTheme';
import { clientRepository } from '@/lib/repositories/clientRepository';
import withObservables from '@nozbe/with-observables';

function ClientsScreen({ clients }: { clients: any[] }) {
    const router = useRouter();
    const navigation = useNavigation();
    const tokens = useTokens();

    // Transform DB records to Client type
    const transformedClients: Client[] = clients.map(client => ({
      id: client.id,
      user_id: client.userId,
      name: client.name,
      email: client.email,
      phone: client.phone,
      date_of_birth: client.dateOfBirth,
      fitness_goals: client.fitnessGoals,
      medical_conditions: client.medicalConditions,
      avatar_url: client.avatarUrl,
      goals: client.goals,
      healthNotes: client.healthNotes,
      emergencyContactName: client.emergencyContactName,
      emergencyContactPhone: client.emergencyContactPhone,
      status: client.status,
      trainerId: client.trainerId,
      workoutSessions: [], // Will be populated if needed
      assessments: [],
      measurements: [],
      photos: [],
      progressPhotos: [],
      clientPackages: [],
      templates: [],
      created_at: client.createdAt,
      updated_at: client.updatedAt,
    }));

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
        <Pressable onPress={() => router.push(`/(app)/(trainer)/(tabs)/clients/${item.id}`)}>
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
                <FlatList
                    data={transformedClients}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            </VStack>
        </SafeAreaView>
    );
}

const enhance = withObservables([], () => ({
  clients: clientRepository.observeClients(),
}));

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

export default enhance(ClientsScreen);