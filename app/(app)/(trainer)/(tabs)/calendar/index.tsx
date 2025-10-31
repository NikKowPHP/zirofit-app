import { View, Text } from '@/components/Themed';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DateData } from 'react-native-calendars';
import { useQuery } from '@tanstack/react-query';
import { getCalendarEvents, planSession } from '@/lib/api';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { YStack } from 'tamagui';

export default function CalendarScreen() {
    const { data: events } = useQuery({ queryKey: ['calendarEvents'], queryFn: getCalendarEvents });
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [sessionTitle, setSessionTitle] = useState('');

    const openModal = (date: DateData) => {
        setSelectedDate(date.dateString);
        setModalVisible(true);
    }

    const handlePlanSession = async () => {
        if (!sessionTitle) return;
        try {
            await planSession({ date: selectedDate, title: sessionTitle });
            Alert.alert("Success", "Session planned successfully.");
            setModalVisible(false);
            setSessionTitle('');
        } catch (e: any) {
            Alert.alert("Error", e.message);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Calendar
                onDayPress={openModal}
                markedDates={events}
                markingType='multi-dot'
            />
            <Modal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                title={`Plan Session for ${selectedDate}`}
            >
                <YStack space="$3">
                    <Input 
                        placeholder="Session Title (e.g., Check-in)"
                        value={sessionTitle}
                        onChangeText={setSessionTitle}
                    />
                    <Button onPress={handlePlanSession}>Save Session</Button>
                </YStack>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
});
      