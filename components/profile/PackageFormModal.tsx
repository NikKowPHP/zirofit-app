import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { YStack } from 'tamagui';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

type Package = {
    id: string;
    name: string;
    description: string;
    price: number;
}

type PackageFormModalProps = {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string, description: string, price: number }) => void;
    initialData?: Package | null;
    isSubmitting: boolean;
}

export default function PackageFormModal({ isVisible, onClose, onSubmit, initialData, isSubmitting }: PackageFormModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        if (isVisible && initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setPrice(initialData.price ? (initialData.price / 100).toString() : '');
        } else if (isVisible && !initialData) {
            setName('');
            setDescription('');
            setPrice('');
        }
    }, [initialData, isVisible]);

    const handleSubmit = () => {
        if (!name || !price) {
            Alert.alert('Missing Fields', 'Please fill in name and price.');
            return;
        }
        const priceInCents = Math.round(parseFloat(price) * 100);
        if (isNaN(priceInCents)) {
             Alert.alert('Invalid Price', 'Please enter a valid number for the price.');
            return;
        }
        onSubmit({
            name,
            description,
            price: priceInCents,
        });
    }

    return (
        <Modal visible={isVisible} onClose={onClose} title={initialData ? "Edit Package" : "Add New Package"}>
            <YStack space="$3">
                <Input placeholder="Package Name (e.g., 10 Session Pack)" value={name} onChangeText={setName} />
                <Input placeholder="Description" value={description} onChangeText={setDescription} />
                <Input placeholder="Price ($)" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
                <Button onPress={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (initialData ? "Save Changes" : "Add Package")}
                </Button>
            </YStack>
        </Modal>
    );
}
      