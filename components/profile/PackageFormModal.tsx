import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { VStack } from '@/components/ui/Stack';
import { useTokens } from '@/hooks/useTheme';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

type Package = {
    id: string;
    name: string;
    description?: string;
    price: number;
    sessionsCount: number;
    durationWeeks: number;
}

type PackageFormModalProps = {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string, description?: string, price: number, sessionsCount: number, durationWeeks: number }) => void;
    initialData?: Package | null;
    isSubmitting: boolean;
}

export default function PackageFormModal({ isVisible, onClose, onSubmit, initialData, isSubmitting }: PackageFormModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [sessionsCount, setSessionsCount] = useState('');
    const [durationWeeks, setDurationWeeks] = useState('');
    const tokens = useTokens();

    useEffect(() => {
        if (isVisible && initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setPrice(initialData.price ? (initialData.price / 100).toString() : '');
            setSessionsCount(initialData.sessionsCount ? initialData.sessionsCount.toString() : '');
            setDurationWeeks(initialData.durationWeeks ? initialData.durationWeeks.toString() : '');
        } else if (isVisible && !initialData) {
            setName('');
            setDescription('');
            setPrice('');
            setSessionsCount('');
            setDurationWeeks('');
        }
    }, [initialData, isVisible]);

    const handleSubmit = () => {
        if (!name || !price || !sessionsCount || !durationWeeks) {
            Alert.alert('Missing Fields', 'Please fill in all fields.');
            return;
        }
        const priceInCents = Math.round(parseFloat(price) * 100);
        const sessionsCountNum = parseInt(sessionsCount);
        const durationWeeksNum = parseInt(durationWeeks);
        if (isNaN(priceInCents)) {
             Alert.alert('Invalid Price', 'Please enter a valid number for the price.');
            return;
        }
        if (isNaN(sessionsCountNum) || sessionsCountNum <= 0) {
             Alert.alert('Invalid Sessions Count', 'Please enter a valid number for sessions count.');
            return;
        }
        if (isNaN(durationWeeksNum) || durationWeeksNum <= 0) {
             Alert.alert('Invalid Duration', 'Please enter a valid number for duration (weeks).');
            return;
        }
        onSubmit({
            name,
            description,
            price: priceInCents,
            sessionsCount: sessionsCountNum,
            durationWeeks: durationWeeksNum,
        });
    }

    return (
        <Modal visible={isVisible} onClose={onClose} title={initialData ? "Edit Package" : "Add New Package"}>
            <VStack style={{ gap: tokens.spacing.md }}>
                <Input placeholder="Package Name (e.g., 10 Session Pack)" value={name} onChangeText={setName} />
                <Input placeholder="Description" value={description} onChangeText={setDescription} />
                <Input placeholder="Price ($)" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
                <Input placeholder="Number of Sessions" value={sessionsCount} onChangeText={setSessionsCount} keyboardType="number-pad" />
                <Input placeholder="Duration (weeks)" value={durationWeeks} onChangeText={setDurationWeeks} keyboardType="number-pad" />
                <Button onPress={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (initialData ? "Save Changes" : "Add Package")}
                </Button>
            </VStack>
        </Modal>
    );
}
      