import { View, Text } from '@/components/Themed';
import { StyleSheet, Alert, ActivityIndicator, ScrollView, Image, Pressable } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { YStack, H3, Separator, XStack } from 'tamagui';
import ServiceFormModal from '@/components/profile/ServiceFormModal';
import PackageFormModal from '@/components/profile/PackageFormModal';
import TestimonialFormModal from '@/components/profile/TestimonialFormModal';
import { Card } from '@/components/ui/Card';
import * as ImagePicker from 'expo-image-picker';

import type {
  TrainerService,
  TrainerPackage,
  TrainerTestimonial,
  AddTrainerServiceRequest,
  AddTrainerPackageRequest,
  AddTrainerTestimonialRequest,
  UpdateTrainerServiceRequest,
  UpdateTrainerPackageRequest,
  UpdateTrainerTestimonialRequest
} from '@/lib/api/types';

type Service = TrainerService;
type Package = TrainerPackage;
type Testimonial = TrainerTestimonial;
type Transformation = { id: string; photo_url: string; };

// Constants
const MODAL_ANIMATION_DURATION = 300;
const ERROR_MESSAGES = {
  SAVE_FAILED: 'Failed to save. Please try again.',
  DELETE_FAILED: 'Failed to delete. Please try again.',
  UPLOAD_FAILED: 'Failed to upload photo. Please try again.',
} as const;


export default function EditProfileScreen() {
    const queryClient = useQueryClient();
    
    const { data: profile, isLoading } = useQuery({
        queryKey: ['trainerProfile'],
        queryFn: api.getTrainerProfile
    });

    // Form states
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [certifications, setCertifications] = useState('');
    const [phone, setPhone] = useState('');

    // Modal states
    const [isServiceModalVisible, setServiceModalVisible] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isPackageModalVisible, setPackageModalVisible] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [isTestimonialModalVisible, setTestimonialModalVisible] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

    // Initialize form data when profile loads
    useEffect(() => {
        if (profile) {
            setName(profile.name || '');
            setUsername(profile.username || '');
            setCertifications((profile.certifications || []).join(', '));
            setPhone(profile.phone || '');
        }
    }, [profile]);

    // Generic mutation options with improved error handling
    const genericMutationOptions = useCallback((entity: string) => ({
        onSuccess: () => {
            Alert.alert('Success', `${entity} saved successfully.`);
            queryClient.invalidateQueries({ queryKey: ['trainerProfile'] });
        },
        onError: (error: any) => {
            const errorMessage = error?.message || ERROR_MESSAGES.SAVE_FAILED;
            Alert.alert('Error', errorMessage);
        },
    }), [queryClient]);

    // Core info mutation
    const coreInfoMutation = useMutation({
        mutationFn: api.updateProfileCoreInfo,
        ...genericMutationOptions('Core Info')
    });
    
    // Service Mutations with proper typing
    const addServiceMutation = useMutation({
        mutationFn: (data: AddTrainerServiceRequest) => api.addTrainerService(data as any),
        ...genericMutationOptions('Service')
    });
    
    const updateServiceMutation = useMutation({
        mutationFn: (data: { serviceId: string; } & AddTrainerServiceRequest) =>
            api.updateTrainerService(data.serviceId, data as any),
        ...genericMutationOptions('Service')
    });
    
    const deleteServiceMutation = useMutation({
        mutationFn: (serviceId: string) => api.deleteTrainerService(serviceId),
        ...genericMutationOptions('Service')
    });

    // Package Mutations with proper typing
    const addPackageMutation = useMutation({
        mutationFn: (data: AddTrainerPackageRequest) => api.addTrainerPackage(data as any),
        ...genericMutationOptions('Package')
    });
    
    const updatePackageMutation = useMutation({
        mutationFn: (data: { packageId: string; } & AddTrainerPackageRequest) =>
            api.updateTrainerPackage(data.packageId, data as any),
        ...genericMutationOptions('Package')
    });
    
    const deletePackageMutation = useMutation({
        mutationFn: (packageId: string) => api.deleteTrainerPackage(packageId),
        ...genericMutationOptions('Package')
    });

    // Testimonial Mutations with proper typing
    const addTestimonialMutation = useMutation({
        mutationFn: (data: AddTrainerTestimonialRequest) => api.addTrainerTestimonial(data as any),
        ...genericMutationOptions('Testimonial')
    });
    
    const updateTestimonialMutation = useMutation({
        mutationFn: (data: { testimonialId: string; } & AddTrainerTestimonialRequest) =>
            api.updateTrainerTestimonial(data.testimonialId, data as any),
        ...genericMutationOptions('Testimonial')
    });
    
    const deleteTestimonialMutation = useMutation({
        mutationFn: (testimonialId: string) => api.deleteTrainerTestimonial(testimonialId),
        ...genericMutationOptions('Testimonial')
    });

    // Transformation Mutations
    const uploadPhotoMutation = useMutation({
        mutationFn: api.uploadTransformationPhoto,
        ...genericMutationOptions('Photo')
    });
    
    const deletePhotoMutation = useMutation({
        mutationFn: api.deleteTransformationPhoto,
        ...genericMutationOptions('Photo')
    });

    // Improved handlers with better error handling
    const confirmDelete = useCallback((onConfirm: () => void, entityName: string = 'item') => {
        Alert.alert(
            "Confirm Delete",
            `Are you sure you want to delete this ${entityName.toLowerCase()}? This action cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: onConfirm }
            ]
        );
    }, []);

    const handlePickImage = useCallback(async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [3, 4],
                quality: 0.7,
            });

            if (!result.canceled && result.assets[0]) {
                const uri = result.assets[0].uri;
                const formData = new FormData();
                formData.append('photo', {
                    uri,
                    name: `photo_${Date.now()}.jpg`,
                    type: 'image/jpeg',
                } as any);
                
                uploadPhotoMutation.mutate({ formData });
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    }, [uploadPhotoMutation]);


    // Calculate overall loading state
    const isAnyMutationPending = [
        coreInfoMutation.isPending,
        addServiceMutation.isPending,
        updateServiceMutation.isPending,
        deleteServiceMutation.isPending,
        addPackageMutation.isPending,
        updatePackageMutation.isPending,
        deletePackageMutation.isPending,
        addTestimonialMutation.isPending,
        updateTestimonialMutation.isPending,
        deleteTestimonialMutation.isPending,
        uploadPhotoMutation.isPending,
        deletePhotoMutation.isPending,
    ].some(Boolean);

    if (isLoading || isAnyMutationPending) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>
                    {isLoading ? 'Loading profile...' : 'Saving changes...'}
                </Text>
            </View>
        );
    }

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Core Info */}
                <YStack space="$4" width="90%" padding="$4">
                    <H3 textAlign="center">Edit Core Info</H3>
                    <Input placeholder="Full Name" value={name} onChangeText={setName} />
                    <Input placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
                    <Input placeholder="Certifications" value={certifications} onChangeText={setCertifications} />
                    <Input placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                    <Button
                        onPress={() => coreInfoMutation.mutate({
                            name,
                            username,
                            certifications: certifications.split(',').map(s => s.trim()).filter(s => s),
                            phone
                        } as any)}
                        disabled={coreInfoMutation.isPending}
                    >
                        {coreInfoMutation.isPending ? 'Saving...' : 'Save Core Info'}
                    </Button>
                </YStack>

                <Separator width="90%" marginVertical="$4" />

                {/* Services */}
                <YStack space="$3" width="90%" padding="$4">
                    <H3 textAlign="center">Manage Services</H3>
                    {profile?.services?.map((s: Service) => (
                        <Card key={s.id} padding="$3">
                            <XStack justifyContent="space-between" alignItems="center">
                                <YStack flex={1} marginRight="$2">
                                    <Text style={styles.itemName}>{s.name}</Text>
                                    <Text style={styles.itemDesc}>{s.description}</Text>
                                    <Text style={styles.itemDetails}>${(s.price / 100).toFixed(2)} / {s.duration} min</Text>
                                </YStack>
                                <YStack space="$2">
                                    <Button size="$3" onPress={() => { setSelectedService(s); setServiceModalVisible(true); }}>Edit</Button>
                                    <Button
                                        size="$3"
                                        variant="danger"
                                        onPress={() => confirmDelete(() => deleteServiceMutation.mutate(s.id), 'service')}
                                        disabled={deleteServiceMutation.isPending}
                                    >
                                        {deleteServiceMutation.isPending ? 'Deleting...' : 'Delete'}
                                    </Button>
                                </YStack>
                            </XStack>
                        </Card>
                    ))}
                    <Button onPress={() => { setSelectedService(null); setServiceModalVisible(true); }} marginTop="$3">Add New Service</Button>
                </YStack>

                <Separator width="90%" marginVertical="$4" />
                
                {/* Packages */}
                <YStack space="$3" width="90%" padding="$4">
                    <H3 textAlign="center">Manage Packages</H3>
                    {profile?.packages?.map((p: Package) => (
                        <Card key={p.id} padding="$3">
                            <XStack justifyContent="space-between" alignItems="center">
                                <YStack flex={1} marginRight="$2">
                                    <Text style={styles.itemName}>{p.name}</Text>
                                    <Text style={styles.itemDesc}>{p.description}</Text>
                                    <Text style={styles.itemDetails}>${(p.price / 100).toFixed(2)}</Text>
                                </YStack>
                                <YStack space="$2">
                                    <Button size="$3" onPress={() => { setSelectedPackage(p); setPackageModalVisible(true); }}>Edit</Button>
                                    <Button
                                        size="$3"
                                        variant="danger"
                                        onPress={() => confirmDelete(() => deletePackageMutation.mutate(p.id), 'package')}
                                        disabled={deletePackageMutation.isPending}
                                    >
                                        {deletePackageMutation.isPending ? 'Deleting...' : 'Delete'}
                                    </Button>
                                </YStack>
                            </XStack>
                        </Card>
                    ))}
                    <Button onPress={() => { setSelectedPackage(null); setPackageModalVisible(true); }} marginTop="$3">Add New Package</Button>
                </YStack>

                <Separator width="90%" marginVertical="$4" />

                {/* Testimonials */}
                 <YStack space="$3" width="90%" padding="$4">
                    <H3 textAlign="center">Manage Testimonials</H3>
                    {profile?.testimonials?.map((t: Testimonial) => (
                         <Card key={t.id} padding="$3">
                            <XStack justifyContent="space-between" alignItems="center">
                                <YStack flex={1} marginRight="$2">
                                    <Text style={styles.itemName}>"{t.content}"</Text>
                                    <Text style={styles.itemDetails}>- {t.client_name}</Text>
                                </YStack>
                                <YStack space="$2">
                                    <Button size="$3" onPress={() => { setSelectedTestimonial(t); setTestimonialModalVisible(true); }}>Edit</Button>
                                    <Button
                                        size="$3"
                                        variant="danger"
                                        onPress={() => confirmDelete(() => deleteTestimonialMutation.mutate(t.id), 'testimonial')}
                                        disabled={deleteTestimonialMutation.isPending}
                                    >
                                        {deleteTestimonialMutation.isPending ? 'Deleting...' : 'Delete'}
                                    </Button>
                                </YStack>
                            </XStack>
                        </Card>
                    ))}
                    <Button onPress={() => { setSelectedTestimonial(null); setTestimonialModalVisible(true); }} marginTop="$3">Add New Testimonial</Button>
                </YStack>

                <Separator width="90%" marginVertical="$4" />

                 {/* Transformations */}
                <YStack space="$3" width="90%" padding="$4">
                    <H3 textAlign="center">Manage Transformation Photos</H3>
                    <View style={styles.photoGrid}>
                        {profile?.transformations?.map((photo: Transformation) => (
                            <View key={photo.id} style={styles.photoContainer}>
                                <Image source={{ uri: photo.photo_url }} style={styles.photo} />
                                <Pressable
                                    style={styles.deleteIcon}
                                    onPress={() => confirmDelete(() => deletePhotoMutation.mutate(photo.id), 'photo')}
                                    disabled={deletePhotoMutation.isPending}
                                >
                                    <Text style={{color: 'white'}}>{deletePhotoMutation.isPending ? '...' : 'X'}</Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                    <Button
                        onPress={handlePickImage}
                        marginTop="$3"
                        disabled={uploadPhotoMutation.isPending}
                    >
                        {uploadPhotoMutation.isPending ? "Uploading..." : "Upload Photo"}
                    </Button>
                </YStack>

            </ScrollView>
            
            {/* Modals */}
            <ServiceFormModal
                isVisible={isServiceModalVisible}
                onClose={() => setServiceModalVisible(false)}
                onSubmit={(data) => {
                    if (selectedService) {
                        updateServiceMutation.mutate({ serviceId: selectedService.id, ...data });
                    } else {
                        addServiceMutation.mutate(data as any);
                    }
                    setServiceModalVisible(false);
                }}
                initialData={selectedService}
                isSubmitting={addServiceMutation.isPending || updateServiceMutation.isPending}
            />
            <PackageFormModal
                isVisible={isPackageModalVisible}
                onClose={() => setPackageModalVisible(false)}
                onSubmit={(data) => {
                    if (selectedPackage) {
                        updatePackageMutation.mutate({ packageId: selectedPackage.id, ...data });
                    } else {
                        addPackageMutation.mutate(data as any);
                    }
                    setPackageModalVisible(false);
                }}
                initialData={selectedPackage}
                isSubmitting={addPackageMutation.isPending || updatePackageMutation.isPending}
            />
            <TestimonialFormModal
                isVisible={isTestimonialModalVisible}
                onClose={() => setTestimonialModalVisible(false)}
                onSubmit={(data) => {
                    if (selectedTestimonial) {
                        updateTestimonialMutation.mutate({ testimonialId: selectedTestimonial.id, ...data });
                    } else {
                        addTestimonialMutation.mutate(data as any);
                    }
                    setTestimonialModalVisible(false);
                }}
                initialData={selectedTestimonial}
                isSubmitting={addTestimonialMutation.isPending || updateTestimonialMutation.isPending}
            />
        </>
    );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingBottom: 50 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: 'gray' },
  itemName: { fontWeight: 'bold', fontSize: 16, },
  itemDesc: { color: 'gray', marginVertical: 2, },
  itemDetails: { fontStyle: 'italic', },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  photoContainer: { position: 'relative', margin: 5 },
  photo: { width: 100, height: 100, borderRadius: 8, backgroundColor: '#eee' },
  deleteIcon: { position: 'absolute', top: 2, right: 2, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }
});
      