import { View, Text } from '@/components/Themed';
import { useClientDetails } from '@/hooks/useClientDetails';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Image } from 'react-native';
import { YStack } from 'tamagui';

export default function PhotosTab() {
  const { id } = useLocalSearchParams();
  const { data: client, isLoading } = useClientDetails(id as string);

  if (isLoading || !client) {
    return <View style={styles.container}><ActivityIndicator /></View>
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={client.photos}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <YStack style={styles.photoContainer}>
            <Image source={{ uri: item.photo_url }} style={styles.photo} />
            <Text style={styles.date}>{new Date(item.taken_at).toLocaleDateString()}</Text>
          </YStack>
        )}
        ListEmptyComponent={<Text>No photos uploaded yet.</Text>}
        contentContainerStyle={{ padding: 5 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    photoContainer: {
        flex: 1 / 2,
        margin: 5,
        alignItems: 'center',
    },
    photo: {
        width: 150,
        height: 200,
        borderRadius: 8,
    },
    date: {
        marginTop: 5,
    }
});
      