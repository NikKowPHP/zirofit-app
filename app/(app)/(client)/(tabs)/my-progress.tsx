import { View, Text } from '@/components/Themed';
import { StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H3, YStack } from 'tamagui';
import { useQuery } from '@tanstack/react-query';
import { getProgressData } from '@/lib/api';
import { LineChart, YAxis, Grid } from 'react-native-svg-charts';

export default function MyProgressScreen() {
    const { data, isLoading } = useQuery({ queryKey: ['progressData'], queryFn: getProgressData });

    const renderChart = () => {
        if (isLoading) {
            return <ActivityIndicator />;
        }
        if (!data || data.weight.length === 0) {
            return <Text>No weight data logged yet.</Text>;
        }

        const weightData = data.weight.map((d: any) => d.value);
        const contentInset = { top: 20, bottom: 20 };

        return (
            <View style={{ height: 200, flexDirection: 'row' }}>
                <YAxis
                    data={weightData}
                    contentInset={contentInset}
                    svg={{
                        fill: 'grey',
                        fontSize: 10,
                    }}
                    numberOfTicks={5}
                    formatLabel={(value) => `${value}kg`}
                />
                <LineChart
                    style={{ flex: 1, marginLeft: 16 }}
                    data={weightData}
                    svg={{ stroke: 'rgb(134, 65, 244)' }}
                    contentInset={contentInset}
                >
                    <Grid />
                </LineChart>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" padding="$4">
                <H3>My Progress</H3>
                <View style={styles.chartContainer}>
                    {renderChart()}
                </View>
            </YStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    chartContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 10,
    }
});
      