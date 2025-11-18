import { View, Text } from '@/components/Themed';
import { useClientDetails } from '@/hooks/useClientDetails';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Image } from 'react-native';
import { VStack } from '@/components/ui/Stack';
import { withObservables } from '@nozbe/watermelondb/react';
import { clientPhotoRepository } from '@/lib/repositories';
import ClientPhoto from '@/lib/db/models/ClientPhoto';

interface PhotosTabProps {
  photos: ClientPhoto[];
}

function PhotosTab({ photos }: PhotosTabProps) {
  const { id } = useLocalSearchParams();
  const { data: client, isLoading: clientLoading } = useClientDetails(id as string);

  const isLoading = clientLoading;

  if (isLoading || !client) {
    return <View style={styles.container}><ActivityIndicator /></View>
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({ item }: { item: ClientPhoto }) => (
          <VStack style={styles.photoContainer}>
            <Image source={{ uri: item.photoUrl }} style={styles.photo} />
            <Text style={styles.date}>{new Date(item.takenAt).toLocaleDateString()}</Text>
          </VStack>
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

const enhance = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const { id } = useLocalSearchParams();
    const clientId = Array.isArray(id) ? id[0] : id;

    // Only create observables if we have a valid clientId
    const observables = clientId ? {
      photos: clientPhotoRepository.observePhotosByClient(clientId),
    } : {
      photos: [],
    };

    const EnhancedComponent = withObservables([], () => observables)(WrappedComponent);

    return <EnhancedComponent {...props} />;
  };
};

export default enhance(PhotosTab);
      