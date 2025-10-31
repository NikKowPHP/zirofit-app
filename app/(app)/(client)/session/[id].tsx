import { View, Text } from '@/components/Themed';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

export default function SessionDetailScreen() {
    const { id } = useLocalSearchParams();

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: `Session ${id}` }} />
            <View style={styles.content}>
                <Text style={styles.title}>Details for Session ID: {id}</Text>
                <Text>Exercise 1: 3 sets of 10 reps</Text>
                <Text>Exercise 2: 4 sets of 12 reps</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 15 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 }
});
      