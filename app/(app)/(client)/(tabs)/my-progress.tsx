import { View, Text } from '@/components/Themed';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H3, YStack } from 'tamagui';

export default function MyProgressScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" padding="$4">
                <H3>My Progress</H3>
                <View style={styles.chartPlaceholder}>
                    <Text>Chart will be displayed here.</Text>
                </View>
            </YStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    chartPlaceholder: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    }
});
      