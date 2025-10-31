import { View, Text } from '@/components/Themed';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProgramsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.center}>
                <Text>Programs Screen</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
      