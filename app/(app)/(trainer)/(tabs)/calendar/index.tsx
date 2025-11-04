import { View, Text } from '@/components/Themed';
import { StyleSheet, Alert } from 'react-native';
import { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DateData } from 'react-native-calendars';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCalendarEvents, planSession, getClients, getPrograms } from '@/lib/api';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { YStack, Select, Adapt, Sheet, Label } from 'tamagui';
import { Check, ChevronDown } from '@tamagui/lucide-icons';

export default function CalendarScreen() {
    const queryClient = useQueryClient();
    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format

    const { startDate, endDate } = useMemo(() => {
        const date = new Date(currentMonth + '-02T00:00:00Z'); // Use 2nd day to avoid timezone issues
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return {
            startDate: firstDay.toISOString().split('T'),
            endDate: lastDay.toISOString().split('T')
        };
    }, [currentMonth]);

    const { data: events } = useQuery({ 
        queryKey: ['calendarEvents', startDate, endDate], 
        queryFn: () => getCalendarEvents(startDate, endDate) 
    });
    const { data: clients } = useQuery({ queryKey: ['clients'], queryFn: getClients });
    const { data: programs } = useQuery({ queryKey: ['programs'], queryFn: getPrograms });
    
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [sessionNotes, setSessionNotes] = useState('');
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');

    const planSessionMutation = useMutation({
        mutationFn: planSession,
        onSuccess: () => {
            Alert.alert("Success", "Session planned successfully.");
            queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
            closeModal();
        },
        onError: (e: any) => {
            Alert.alert("Error", e.message);
        }
    })

    const openModal = (date: DateData) => {
        setSelectedDate(date.dateString);
        setModalVisible(true);
    }

    const closeModal = () => {
        setModalVisible(false);
        setSessionNotes('');
        setSelectedClient('');
        setSelectedTemplate('');
    }

    const handlePlanSession = async () => {
        if (!sessionNotes || !selectedClient) {
            Alert.alert("Missing Info", "Please provide notes and select a client.");
            return;
        };
        planSessionMutation.mutate({ 
            date: selectedDate, 
            notes: sessionNotes,
            clientId: selectedClient,
            templateId: selectedTemplate,
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <Calendar
                onDayPress={openModal}
                markedDates={events}
                markingType='multi-dot'
                onMonthChange={(month) => setCurrentMonth(month.dateString.slice(0, 7))}
            />
            <Modal
                visible={modalVisible}
                onClose={closeModal}
                title={`Plan Session for ${selectedDate}`}
            >
                <YStack space="$3">
                    <Input 
                        placeholder="Session Notes (e.g., Check-in)"
                        value={sessionNotes}
                        onChangeText={setSessionNotes}
                    />
                    <Label>Client</Label>
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                        <Select.Trigger iconAfter={ChevronDown}>
                            <Select.Value placeholder="Select a client" />
                        </Select.Trigger>
                        <Adapt when="sm" platform="native">
                            <Sheet modal dismissOnSnapToBottom>
                                <Sheet.Frame>
                                    <Sheet.ScrollView><Adapt.Contents /></Sheet.ScrollView>
                                </Sheet.Frame>
                                <Sheet.Overlay />
                            </Sheet>
                        </Adapt>
                        <Select.Content>
                            <Select.Viewport>
                                {clients?.map((c: any) => (
                                    <Select.Item index={c.id} key={c.id} value={c.id}>
                                        <Select.ItemText>{c.name}</Select.ItemText>
                                        <Select.ItemIndicator marginLeft="auto"><Check size={16} /></Select.ItemIndicator>
                                    </Select.Item>
                                ))}
                            </Select.Viewport>
                        </Select.Content>
                    </Select>

                    <Label>Program/Template (Optional)</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                         <Select.Trigger iconAfter={ChevronDown}>
                            <Select.Value placeholder="Select a program" />
                        </Select.Trigger>
                        <Adapt when="sm" platform="native">
                            <Sheet modal dismissOnSnapToBottom>
                                <Sheet.Frame>
                                    <Sheet.ScrollView><Adapt.Contents /></Sheet.ScrollView>
                                </Sheet.Frame>
                                <Sheet.Overlay />
                            </Sheet>
                        </Adapt>
                         <Select.Content>
                            <Select.Viewport>
                                {programs?.map((p: any) => (
                                    <Select.Item index={p.id} key={p.id} value={p.id}>
                                        <Select.ItemText>{p.name}</Select.ItemText>
                                        <Select.ItemIndicator marginLeft="auto"><Check size={16} /></Select.ItemIndicator>
                                    </Select.Item>
                                ))}
                            </Select.Viewport>
                        </Select.Content>
                    </Select>

                    <Button onPress={handlePlanSession} disabled={planSessionMutation.isPending} mt="$4">
                        {planSessionMutation.isPending ? 'Saving...' : 'Save Session'}
                    </Button>
                </YStack>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
});
      