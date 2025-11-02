import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { YStack } from 'tamagui';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

type Service = {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
}

type ServiceFormModalProps = {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string, description?: string, price: number, duration: number }) => void;
    initialData?: Service | null;
    isSubmitting: boolean;
}

export default function ServiceFormModal({ isVisible, onClose, onSubmit, initialData, isSubmitting }: ServiceFormModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');

    useEffect(() => {
        if (isVisible && initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setPrice(initialData.price ? (initialData.price / 100).toString() : '');
            setDuration(initialData.duration ? initialData.duration.toString() : '');
        } else if (isVisible && !initialData) {
            setName('');
            setDescription('');
            setPrice('');
            setDuration('');
        }
    }, [initialData, isVisible]);

    const handleSubmit = () => {
        if (!name || !price || !duration) {
            Alert.alert('Missing Fields', 'Please fill in name, price, and duration.');
            return;
        }
        const priceInCents = Math.round(parseFloat(price) * 100);
        const durationInMinutes = parseInt(duration);
        
        if (isNaN(priceInCents)) {
             Alert.alert('Invalid Price', 'Please enter a valid number for the price.');
            return;
        }
        
        if (isNaN(durationInMinutes) || durationInMinutes <= 0) {
            Alert.alert('Invalid Duration', 'Please enter a valid number for the duration (minutes).');
            return;
        }
        
        onSubmit({
            name,
            description,
            price: priceInCents,
            duration: durationInMinutes,
        });
    }

    return (
        <Modal visible={isVisible} onClose={onClose} title={initialData ? "Edit Service" : "Add New Service"}>
            <YStack space="$3">
                <Input placeholder="Service Name (e.g., Personal Training)" value={name} onChangeText={setName} />
                <Input placeholder="Description (optional)" value={description} onChangeText={setDescription} />
                <Input placeholder="Price ($)" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
                <Input placeholder="Duration (minutes)" value={duration} onChangeText={setDuration} keyboardType="number-pad" />
                <Button onPress={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (initialData ? "Save Changes" : "Add Service")}
                </Button>
            </YStack>
        </Modal>
    );
}
      