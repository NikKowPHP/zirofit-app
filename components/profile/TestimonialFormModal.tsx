import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { VStack } from '@/components/ui/Stack';
import { useTokens } from '@/hooks/useTheme';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

type Testimonial = {
    id: string;
    client_name: string;
    content: string;
}

type TestimonialFormModalProps = {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (data: { client_name: string, content: string }) => void;
    initialData?: Testimonial | null;
    isSubmitting: boolean;
}

export default function TestimonialFormModal({ isVisible, onClose, onSubmit, initialData, isSubmitting }: TestimonialFormModalProps) {
    const [clientName, setClientName] = useState('');
    const [content, setContent] = useState('');
    const tokens = useTokens();

    useEffect(() => {
        if (isVisible && initialData) {
            setClientName(initialData.client_name || '');
            setContent(initialData.content || '');
        } else if (isVisible && !initialData) {
            setClientName('');
            setContent('');
        }
    }, [initialData, isVisible]);

    const handleSubmit = () => {
        if (!clientName || !content) {
            Alert.alert('Missing Fields', 'Please fill in all fields.');
            return;
        }
        onSubmit({
            client_name: clientName,
            content,
        });
    }

    return (
        <Modal visible={isVisible} onClose={onClose} title={initialData ? "Edit Testimonial" : "Add New Testimonial"}>
            <VStack style={{ gap: tokens.spacing.md }}>
                <Input placeholder="Client Name" value={clientName} onChangeText={setClientName} />
                <Input 
                    placeholder="Testimonial Content..." 
                    value={content} 
                    onChangeText={setContent} 
                    multiline 
                    numberOfLines={4}
                    style={{ height: 100 }}
                    textAlignVertical="top"
                />
                <Button onPress={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (initialData ? "Save Changes" : "Add Testimonial")}
                </Button>
            </VStack>
        </Modal>
    );
}
      