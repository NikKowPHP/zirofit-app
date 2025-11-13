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

const extractArray = (response: unknown): any[] => {
    if (Array.isArray(response)) {
        return response;
    }

    if (response && typeof response === 'object') {
        const record = response as Record<string, unknown>;

        const data = record['data'];
        if (Array.isArray(data)) {
            return data as any[];
        }

        const items = record['items'];
        if (Array.isArray(items)) {
            return items as any[];
        }

        const events = record['events'];
        if (Array.isArray(events)) {
            return events as any[];
        }
    }

    return [];
};

export default function CalendarScreen() {
    const queryClient = useQueryClient();
    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format

    const { startDate, endDate } = useMemo(() => {
        const date = new Date(currentMonth + '-02T00:00:00Z'); // Use 2nd day to avoid timezone issues
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return {
            startDate: firstDay.toISOString().split('T')[0],
            endDate: lastDay.toISOString().split('T')[0]
        };
    }, [currentMonth]);

    const { data: eventsResponse } = useQuery({
        queryKey: ['calendarEvents', startDate, endDate],
        queryFn: () => getCalendarEvents({ startDate, endDate })
    });
    const events = useMemo(() => extractArray(eventsResponse), [eventsResponse]);
    const markedDates = useMemo(() => {
        if (!events.length) return {};
        const dates: { [key: string]: { dots: { key: string; color: string }[] } } = {};
        events.forEach((event: any) => {
            const date = event.start.split('T')[0];
            if (!dates[date]) {
                dates[date] = { dots: [] };
            }
            dates[date].dots.push({ key: event.id, color: 'blue' });
        });
        return dates;
    }, [events]);
    const { data: clientsResponse } = useQuery({ queryKey: ['clients'], queryFn: getClients });
    const clients = useMemo(() => extractArray(clientsResponse), [clientsResponse]);
    const { data: programsResponse } = useQuery({ queryKey: ['programs'], queryFn: getPrograms });
    const programs = useMemo(() => extractArray(programsResponse), [programsResponse]);
    
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [sessionNotes, setSessionNotes] = useState('');
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');

    const selectedDayEvents = useMemo(() => {
        if (!selectedDate || !events.length) return [];
        return events.filter((event: any) => event.start.split('T')[0] === selectedDate);
    }, [selectedDate, events]);

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
                markedDates={markedDates}
                markingType='multi-dot'
                onMonthChange={(month) => setCurrentMonth(month.dateString.slice(0, 7))}
            />
            {selectedDayEvents.length > 0 && (
                <View style={styles.eventsContainer}>
                    <Text style={styles.eventsTitle}>Events for {selectedDate}</Text>
                    {selectedDayEvents.map((event: any) => (
                        <View key={event.id} style={styles.eventItem}>
                            <Text style={styles.eventTitle}>{event.title}</Text>
                            <Text>{new Date(event.start).toLocaleTimeString()} - {new Date(event.end).toLocaleTimeString()}</Text>
                            <Text>{event.notes}</Text>
                        </View>
                    ))}
                </View>
            )}
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
                        <Adapt when="sm">
                            <Sheet modal dismissOnSnapToBottom>
                                <Sheet.Frame>
                                    <Sheet.ScrollView><Adapt.Contents /></Sheet.ScrollView>
                                </Sheet.Frame>
                                <Sheet.Overlay />
                            </Sheet>
                        </Adapt>
                        <Select.Content>
                            <Select.Viewport>
                                {clients.map((c: any) => (
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
                        <Adapt when="sm">
                            <Sheet modal dismissOnSnapToBottom>
                                <Sheet.Frame>
                                    <Sheet.ScrollView><Adapt.Contents /></Sheet.ScrollView>
                                </Sheet.Frame>
                                <Sheet.Overlay />
                            </Sheet>
                        </Adapt>
                         <Select.Content>
                            <Select.Viewport>
                                {programs.map((p: any) => (
                                    <Select.Item index={p.id} key={p.id} value={p.id}>
                                        <Select.ItemText>{p.name}</Select.ItemText>
                                        <Select.ItemIndicator marginLeft="auto"><Check size={16} /></Select.ItemIndicator>
                                    </Select.Item>
                                ))}
                            </Select.Viewport>
                        </Select.Content>
                    </Select>

                    <Button onPress={handlePlanSession} disabled={planSessionMutation.isPending} mt="$xl">
                        {planSessionMutation.isPending ? 'Saving...' : 'Save Session'}
                    </Button>
                </YStack>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    eventsContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    eventsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    eventItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 1,
    },
    eventTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
});
      