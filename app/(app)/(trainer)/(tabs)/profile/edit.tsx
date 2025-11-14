import { View, Text } from '@/components/Themed';
import { StyleSheet, Alert, ActivityIndicator, ScrollView, Image, Pressable } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { VStack, HStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { useTheme, useTokens } from '@/hooks/useTheme';
import ServiceFormModal from '@/components/profile/ServiceFormModal';
import PackageFormModal from '@/components/profile/PackageFormModal';
import TestimonialFormModal from '@/components/profile/TestimonialFormModal';
import { Card } from '@/components/ui/Card';
import { useAssetUploadQueue } from '@/hooks/useAssetUploadQueue';
import AssetUploadQueue from '@/components/ui/AssetUploadQueue';
import * as ImagePicker from 'expo-image-picker';
import { withObservables } from '@nozbe/watermelondb/react';
import { trainerProfileRepository, trainerServiceRepository, trainerPackageRepository, trainerTestimonialRepository } from '@/lib/repositories';
import TrainerProfile from '@/lib/db/models/TrainerProfile';
import TrainerService from '@/lib/db/models/TrainerService';
import TrainerPackage from '@/lib/db/models/TrainerPackage';
import TrainerTestimonial from '@/lib/db/models/TrainerTestimonial';
import React from 'react';

type Service = TrainerService;
type Package = TrainerPackage;
type Testimonial = TrainerTestimonial;
type Transformation = { id: string; photo_url: string; };

interface EditProfileScreenProps {
  profile: TrainerProfile[];
  services: TrainerService[];
  packages: TrainerPackage[];
  testimonials: TrainerTestimonial[];
}

// Constants
const MODAL_ANIMATION_DURATION = 300;
const ERROR_MESSAGES = {
  SAVE_FAILED: 'Failed to save. Please try again.',
  DELETE_FAILED: 'Failed to delete. Please try again.',
  UPLOAD_FAILED: 'Failed to upload photo. Please try again.',
} as const;

function EditProfileScreen({ profile, services, packages, testimonials }: EditProfileScreenProps) {
    const theme = useTheme();
    const tokens = useTokens();
    const { addAsset } = useAssetUploadQueue();

    const profileData = profile.length > 0 ? profile[0] : null;

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
        if (profileData) {
            setName(profileData.name || '');
            setUsername(profileData.username || '');
            const certs = Array.isArray(profileData.certifications) ? profileData.certifications : [];
            setCertifications(certs.join(', '));
            setPhone(profileData.phone || '');
        }
    }, [profileData]);

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

    const handleSaveCoreInfo = async () => {
        if (!profileData) return;
        try {
            await trainerProfileRepository.updateTrainerProfile(profileData.id, {
                name,
                username,
                phone,
                // Note: certifications would need to be handled differently since it's stored as JSON
            });
            Alert.alert('Success', 'Core Info saved successfully.');
        } catch (error) {
            Alert.alert('Error', ERROR_MESSAGES.SAVE_FAILED);
        }
    };

    const handleAddService = async (data: any) => {
        try {
            await trainerServiceRepository.createTrainerService({
                trainerId: profileData?.id || '',
                name: data.name,
                description: data.description,
                price: data.price,
                duration: data.duration,
                isActive: true,
            });
            Alert.alert('Success', 'Service saved successfully.');
            setServiceModalVisible(false);
        } catch (error) {
            Alert.alert('Error', ERROR_MESSAGES.SAVE_FAILED);
        }
    };

    const handleUpdateService = async (serviceId: string, data: any) => {
        try {
            await trainerServiceRepository.updateTrainerService(serviceId, {
                name: data.name,
                description: data.description,
                price: data.price,
                duration: data.duration,
            });
            Alert.alert('Success', 'Service saved successfully.');
            setServiceModalVisible(false);
        } catch (error) {
            Alert.alert('Error', ERROR_MESSAGES.SAVE_FAILED);
        }
    };

    const handleDeleteService = async (serviceId: string) => {
        try {
            await trainerServiceRepository.deleteTrainerService(serviceId);
            Alert.alert('Success', 'Service deleted successfully.');
        } catch (error) {
            Alert.alert('Error', ERROR_MESSAGES.DELETE_FAILED);
        }
    };

    const handleAddPackage = async (data: any) => {
        try {
            await trainerPackageRepository.createTrainerPackage({
                trainerId: profileData?.id || '',
                name: data.name,
                description: data.description,
                price: data.price,
                sessionsCount: data.sessionsCount,
                durationWeeks: data.durationWeeks,
                isActive: true,
            });
            Alert.alert('Success', 'Package saved successfully.');
            setPackageModalVisible(false);
        } catch (error) {
            Alert.alert('Error', ERROR_MESSAGES.SAVE_FAILED);
        }
    };

    const handleUpdatePackage = async (packageId: string, data: any) => {
        try {
            await trainerPackageRepository.updateTrainerPackage(packageId, {
                name: data.name,
                description: data.description,
                price: data.price,
                sessionsCount: data.sessionsCount,
                durationWeeks: data.durationWeeks,
            });
            Alert.alert('Success', 'Package saved successfully.');
            setPackageModalVisible(false);
        } catch (error) {
            Alert.alert('Error', ERROR_MESSAGES.SAVE_FAILED);
        }
    };

    const handleDeletePackage = async (packageId: string) => {
        try {
            await trainerPackageRepository.deleteTrainerPackage(packageId);
            Alert.alert('Success', 'Package deleted successfully.');
        } catch (error) {
            Alert.alert('Error', ERROR_MESSAGES.DELETE_FAILED);
        }
    };

    const handleAddTestimonial = async (data: any) => {
        try {
            await trainerTestimonialRepository.createTrainerTestimonial({
                trainerId: profileData?.id || '',
                clientName: data.clientName,
                content: data.content,
                rating: data.rating,
                isActive: true,
            });
            Alert.alert('Success', 'Testimonial saved successfully.');
            setTestimonialModalVisible(false);
        } catch (error) {
            Alert.alert('Error', ERROR_MESSAGES.SAVE_FAILED);
        }
    };

    const handleUpdateTestimonial = async (testimonialId: string, data: any) => {
        try {
            await trainerTestimonialRepository.updateTrainerTestimonial(testimonialId, {
                clientName: data.clientName,
                content: data.content,
                rating: data.rating,
            });
            Alert.alert('Success', 'Testimonial saved successfully.');
            setTestimonialModalVisible(false);
        } catch (error) {
            Alert.alert('Error', ERROR_MESSAGES.SAVE_FAILED);
        }
    };

    const handleDeleteTestimonial = async (testimonialId: string) => {
        try {
            await trainerTestimonialRepository.deleteTrainerTestimonial(testimonialId);
            Alert.alert('Success', 'Testimonial deleted successfully.');
        } catch (error) {
            Alert.alert('Error', ERROR_MESSAGES.DELETE_FAILED);
        }
    };

    const handlePickImage = useCallback(async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [3, 4],
                quality: 0.7,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                const fileName = `transformation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
                const uploadPath = `transformations/${fileName}`;

                await addAsset({
                    fileUri: asset.uri,
                    fileName,
                    mimeType: 'image/jpeg',
                    size: asset.fileSize || 0,
                    uploadPath,
                    metadata: {
                        userId: profileData?.id || 'unknown',
                        type: 'transformation',
                    },
                });

                Alert.alert('Success', 'Photo added to upload queue. It will be uploaded when you\'re online.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    }, [addAsset, profileData]);

    if (!profileData) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Core Info */}
                <VStack style={{ gap: tokens.spacing.lg, width: '90%', padding: tokens.spacing.lg }}>
                    <UIText variant="h3" style={{ textAlign: 'center' }}>Edit Core Info</UIText>
                    <Input placeholder="Full Name" value={name} onChangeText={setName} />
                    <Input placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
                    <Input placeholder="Certifications" value={certifications} onChangeText={setCertifications} />
                    <Input placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                    <Button
                        onPress={handleSaveCoreInfo}
                    >
                        Save Core Info
                    </Button>
                </VStack>

                <View style={{ width: '90%', height: 1, backgroundColor: '#ccc', marginVertical: tokens.spacing.lg }} />

                {/* Services */}
                <VStack style={{ gap: tokens.spacing.md, width: '90%', padding: tokens.spacing.lg }}>
                    <UIText variant="h3" style={{ textAlign: 'center' }}>Manage Services</UIText>
                    {services?.map((s: Service) => (
                        <Card key={s.id}>
                            <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <VStack style={{ flex: 1, marginRight: tokens.spacing.sm }}>
                                    <Text style={styles.itemName}>{s.name}</Text>
                                    <Text style={styles.itemDesc}>{s.description}</Text>
                                    <Text style={styles.itemDetails}>${(s.price / 100).toFixed(2)} / {s.duration} min</Text>
                                </VStack>
                                <VStack style={{ gap: tokens.spacing.sm }}>
                                    <Button onPress={() => { setSelectedService(s); setServiceModalVisible(true); }}>Edit</Button>
                                    <Button
                                        variant="danger"
                                        onPress={() => confirmDelete(() => handleDeleteService(s.id), 'service')}
                                    >
                                        Delete
                                    </Button>
                                </VStack>
                            </HStack>
                        </Card>
                    ))}
                    <Button onPress={() => { setSelectedService(null); setServiceModalVisible(true); }} style={{ marginTop: tokens.spacing.md }}>Add New Service</Button>
                </VStack>

                <View style={{ width: '90%', height: 1, backgroundColor: '#ccc', marginVertical: tokens.spacing.lg }} />
                
                {/* Packages */}
                <VStack style={{ gap: tokens.spacing.md, width: '90%', padding: tokens.spacing.lg }}>
                    <UIText variant="h3" style={{ textAlign: 'center' }}>Manage Packages</UIText>
                    {packages?.map((p: Package) => (
                        <Card key={p.id}>
                            <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <VStack style={{ flex: 1, marginRight: tokens.spacing.sm }}>
                                    <Text style={styles.itemName}>{p.name}</Text>
                                    <Text style={styles.itemDesc}>{p.description}</Text>
                                    <Text style={styles.itemDetails}>${(p.price / 100).toFixed(2)}</Text>
                                </VStack>
                                <VStack style={{ gap: tokens.spacing.sm }}>
                                    <Button onPress={() => { setSelectedPackage(p); setPackageModalVisible(true); }}>Edit</Button>
                                    <Button
                                        variant="danger"
                                        onPress={() => confirmDelete(() => handleDeletePackage(p.id), 'package')}
                                    >
                                        Delete
                                    </Button>
                                </VStack>
                            </HStack>
                        </Card>
                    ))}
                    <Button onPress={() => { setSelectedPackage(null); setPackageModalVisible(true); }} style={{ marginTop: tokens.spacing.md }}>Add New Package</Button>
                </VStack>

                <View style={{ width: '90%', height: 1, backgroundColor: '#ccc', marginVertical: tokens.spacing.lg }} />

                {/* Testimonials */}
                 <VStack style={{ gap: tokens.spacing.md, width: '90%', padding: tokens.spacing.lg }}>
                    <UIText variant="h3" style={{ textAlign: 'center' }}>Manage Testimonials</UIText>
                    {testimonials?.map((t: Testimonial) => (
                         <Card key={t.id}>
                            <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <VStack style={{ flex: 1, marginRight: tokens.spacing.sm }}>
                                    <Text style={styles.itemName}>"{t.content}"</Text>
                                    <Text style={styles.itemDetails}>- {t.clientName}</Text>
                                </VStack>
                                <VStack style={{ gap: tokens.spacing.sm }}>
                                    <Button onPress={() => { setSelectedTestimonial(t); setTestimonialModalVisible(true); }}>Edit</Button>
                                    <Button
                                        variant="danger"
                                        onPress={() => confirmDelete(() => handleDeleteTestimonial(t.id), 'testimonial')}
                                    >
                                        Delete
                                    </Button>
                                </VStack>
                            </HStack>
                        </Card>
                    ))}
                    <Button onPress={() => { setSelectedTestimonial(null); setTestimonialModalVisible(true); }} style={{ marginTop: tokens.spacing.md }}>Add New Testimonial</Button>
                </VStack>

                <View style={{ width: '90%', height: 1, backgroundColor: '#ccc', marginVertical: tokens.spacing.lg }} />

                 {/* Transformations */}
                <VStack style={{ gap: tokens.spacing.md, width: '90%', padding: tokens.spacing.lg }}>
                    <UIText variant="h3" style={{ textAlign: 'center' }}>Manage Transformation Photos</UIText>
                    
                    {/* Upload Queue */}
                    <AssetUploadQueue />

                    <View style={styles.photoGrid}>
                        {/* Transformation photos would be shown here when implemented */}
                        <Text style={{ textAlign: 'center', padding: tokens.spacing.lg, color: theme.textSecondary }}>
                            Transformation photos will be displayed here once uploaded.
                        </Text>
                    </View>
                    
                    <Button
                        onPress={handlePickImage}
                        style={{ marginTop: tokens.spacing.md }}
                    >
                        Upload Transformation Photo
                    </Button>
                </VStack>

            </ScrollView>
            
            {/* Modals */}
            <ServiceFormModal
                isVisible={isServiceModalVisible}
                onClose={() => setServiceModalVisible(false)}
                onSubmit={(data) => {
                    if (selectedService) {
                        handleUpdateService(selectedService.id, data);
                    } else {
                        handleAddService(data);
                    }
                }}
                initialData={selectedService}
                isSubmitting={false}
            />
            <PackageFormModal
                isVisible={isPackageModalVisible}
                onClose={() => setPackageModalVisible(false)}
                onSubmit={(data) => {
                    if (selectedPackage) {
                        handleUpdatePackage(selectedPackage.id, data);
                    } else {
                        handleAddPackage(data);
                    }
                }}
                initialData={selectedPackage}
                isSubmitting={false}
            />
            <TestimonialFormModal
                isVisible={isTestimonialModalVisible}
                onClose={() => setTestimonialModalVisible(false)}
                onSubmit={(data) => {
                    if (selectedTestimonial) {
                        handleUpdateTestimonial(selectedTestimonial.id, data);
                    } else {
                        handleAddTestimonial(data);
                    }
                }}
                initialData={selectedTestimonial}
                isSubmitting={false}
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

const enhance = withObservables([], () => ({
    profile: trainerProfileRepository.observeTrainerProfiles(),
    services: trainerServiceRepository.observeTrainerServices(),
    packages: trainerPackageRepository.observeTrainerPackages(),
    testimonials: trainerTestimonialRepository.observeTrainerTestimonials(),
}));

export default enhance(EditProfileScreen);