import { View, Text } from '@/components/Themed';
import { StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DateData } from 'react-native-calendars';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { useTokens } from '@/hooks/useTheme';
import { calendarEventRepository } from '@/lib/repositories/calendarEventRepository';
import { clientRepository } from '@/lib/repositories/clientRepository';
import { trainerProgramRepository } from '@/lib/repositories/trainerProgramRepository';
import withObservables from '@nozbe/with-observables';
import useAuthStore from '@/store/authStore';

function CalendarScreen({ calendarEvents, clients, programs }: { 
  calendarEvents: any[], 
  clients: any[], 
  programs: any[] 
}) {
    const { user } = useAuthStore();
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

    // Transform DB records to API format for compatibility
    const events = useMemo(() => calendarEvents.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.startTime).toISOString(),
      end: new Date(event.endTime).toISOString(),
      notes: event.notes,
      status: event.status
    })), [calendarEvents]);

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

    const [isSaving, setIsSaving] = useState(false);

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
        }

        if (!user?.id) {
            Alert.alert("Error", "User not authenticated.");
            return;
        }
        
        setIsSaving(true);
        try {
            // Create locally - sync service will handle server sync
            await calendarEventRepository.createCalendarEvent({
                trainerId: user.id,
                clientId: selectedClient,
                title: `Session with ${clients.find(c => c.id === selectedClient)?.name}`,
                startTime: new Date(selectedDate + 'T10:00:00').getTime(), // Default 10 AM
                endTime: new Date(selectedDate + 'T11:00:00').getTime(), // Default 1 hour
                notes: sessionNotes,
                status: 'scheduled',
                sessionType: 'training',
                templateId: selectedTemplate || undefined
            });
            
            Alert.alert("Success", "Session planned successfully.");
            closeModal();
        } catch (error: any) {
            console.error('Error planning session:', error);
            Alert.alert("Error", error.message || "Failed to plan session");
        } finally {
            setIsSaving(false);
        }
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

                    <Button onPress={handlePlanSession} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Session'}
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

const enhance = withObservables([], () => ({
  calendarEvents: calendarEventRepository.observeCalendarEvents(),
  clients: clientRepository.observeClients(),
  programs: trainerProgramRepository.observeTrainerPrograms(),
}));

export default enhance(CalendarScreen);

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
      