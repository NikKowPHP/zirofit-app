import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { VStack } from '@/components/ui/Stack';
import { useAssetUploadQueue } from '@/hooks/useAssetUploadQueue';
import { useClientDetails } from '@/hooks/useClientDetails';
import ClientPhoto from '@/lib/db/models/ClientPhoto';
import { clientPhotoRepository } from '@/lib/repositories';
import { withObservables } from '@nozbe/watermelondb/react';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet } from 'react-native';

interface PhotosTabProps {
  photos: ClientPhoto[];
}

function PhotosTab({ photos }: PhotosTabProps) {
  const { id } = useLocalSearchParams();
  const clientId = Array.isArray(id) ? id[0] : id;
  const { data: client, isLoading: clientLoading } = useClientDetails(clientId as string);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addAsset } = useAssetUploadQueue();

  const isLoading = clientLoading;

  const handlePickImage = useCallback(async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to add photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  }, []);

  const handleTakePhoto = useCallback(async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera permissions to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  }, []);

  const handleAddPhoto = async () => {
    if (!selectedImage || !clientId) {
      Alert.alert('Error', 'Please select an image.');
      return;
    }

    setIsSubmitting(true);
    try {
      // For now, we'll store the local URI. In production, you'd upload to a server
      // and get back a URL. For now, we'll use the local URI and sync will handle upload
      await clientPhotoRepository.createClientPhoto({
        clientId: clientId as string,
        photoUrl: selectedImage, // This will be a local URI initially
        caption: caption || undefined,
        takenAt: Date.now(),
      });

      // Add to upload queue for background upload
      const fileName = `client_photo_${clientId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
      const uploadPath = `client-photos/${clientId}/${fileName}`;
      
      await addAsset({
        fileUri: selectedImage,
        fileName,
        mimeType: 'image/jpeg',
        size: 0, // Will be determined during upload
        uploadPath,
        metadata: {
          clientId: clientId as string,
          type: 'client_photo',
        },
      });

      Alert.alert('Success', 'Photo added successfully. It will be uploaded when online.');
      setModalVisible(false);
      setSelectedImage(null);
      setCaption('');
    } catch (error) {
      console.error('Error adding photo:', error);
      Alert.alert('Error', 'Failed to add photo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !client) {
    return <View style={styles.container}><ActivityIndicator /></View>
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={photos || []}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({ item }: { item: ClientPhoto }) => (
          <VStack style={styles.photoContainer}>
            <Image source={{ uri: item.photoUrl }} style={styles.photo} />
            <Text style={styles.date}>{new Date(item.takenAt).toLocaleDateString()}</Text>
            {item.caption && (
              <Text style={styles.caption} numberOfLines={2}>{item.caption}</Text>
            )}
          </VStack>
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Button onPress={handlePickImage} style={styles.button}>
              📷 Choose from Library
            </Button>
            <Button onPress={handleTakePhoto} variant="outline" style={styles.button}>
              📸 Take Photo
            </Button>
          </View>
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No photos uploaded yet.</Text>}
        contentContainerStyle={{ padding: 5 }}
      />

      <Modal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedImage(null);
          setCaption('');
        }}
        title="Add Photo"
      >
        <VStack style={styles.modalContent}>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          )}
          
          <Text style={styles.label}>Caption (Optional)</Text>
          <Input
            value={caption}
            onChangeText={setCaption}
            placeholder="Add a caption..."
            multiline
            numberOfLines={3}
          />

          <View style={styles.buttonRow}>
            <Button
              onPress={() => {
                setModalVisible(false);
                setSelectedImage(null);
                setCaption('');
              }}
              variant="outline"
              style={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              onPress={handleAddPhoto}
              disabled={isSubmitting || !selectedImage}
              style={styles.submitButton}
            >
              {isSubmitting ? 'Adding...' : 'Add Photo'}
            </Button>
          </View>
        </VStack>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        padding: 10,
        paddingBottom: 15,
        gap: 10,
    },
    button: {
        marginBottom: 5,
    },
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
        fontSize: 12,
    },
    caption: {
        marginTop: 2,
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
    modalContent: {
        gap: 12,
    },
    previewImage: {
        width: '100%',
        height: 300,
        borderRadius: 8,
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },
    cancelButton: {
        flex: 1,
    },
    submitButton: {
        flex: 1,
    },
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
      