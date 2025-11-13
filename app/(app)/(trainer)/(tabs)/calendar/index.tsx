import { View, Text } from '@/components/Themed';
import { StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DateData } from 'react-native-calendars';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCalendarEvents, planSession, getClients, getPrograms } from '@/lib/api';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { useTokens } from '@/hooks/useTheme';

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
    const tokens = useTokens();

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
    const [selectModalVisible, setSelectModalVisible] = useState(false);
    const [selectType, setSelectType] = useState<'client' | 'program'>('client');

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

    const openSelectModal = (type: 'client' | 'program') => {
        setSelectType(type);
        setSelectModalVisible(true);
    }

    const closeSelectModal = () => {
        setSelectModalVisible(false);
    }

    const selectItem = (id: string) => {
        if (selectType === 'client') {
            setSelectedClient(id);
        } else {
            setSelectedTemplate(id);
        }
        closeSelectModal();
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
                <VStack style={{ gap: tokens.spacing.md }}>
                    <Input 
                        placeholder="Session Notes (e.g., Check-in)"
                        value={sessionNotes}
                        onChangeText={setSessionNotes}
                    />
                    <UIText variant="body">Client</UIText>
                    <TouchableOpacity style={styles.selectButton} onPress={() => openSelectModal('client')}>
                        <UIText variant="body">{selectedClient ? clients.find(c => c.id === selectedClient)?.name : 'Select a client'}</UIText>
                    </TouchableOpacity>

                    <UIText variant="body">Program/Template (Optional)</UIText>
                    <TouchableOpacity style={styles.selectButton} onPress={() => openSelectModal('program')}>
                        <UIText variant="body">{selectedTemplate ? programs.find(p => p.id === selectedTemplate)?.name : 'Select a program'}</UIText>
                    </TouchableOpacity>

                    <Button onPress={handlePlanSession} disabled={planSessionMutation.isPending}>
                        {planSessionMutation.isPending ? 'Saving...' : 'Save Session'}
                    </Button>
                </VStack>
            </Modal>
            <Modal
                visible={selectModalVisible}
                onClose={closeSelectModal}
                title={`Select ${selectType === 'client' ? 'Client' : 'Program'}`}
            >
                <ScrollView>
                    <VStack style={{ gap: tokens.spacing.sm }}>
                        {(selectType === 'client' ? clients : programs).map((item: any) => (
                            <TouchableOpacity key={item.id} style={styles.selectItem} onPress={() => selectItem(item.id)}>
                                <UIText variant="body">{item.name}</UIText>
                            </TouchableOpacity>
                        ))}
                    </VStack>
                </ScrollView>
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
    selectButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    selectItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
});
      