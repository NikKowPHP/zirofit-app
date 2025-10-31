import { View, Text } from '@/components/Themed';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H3, YStack, ToggleGroup, Label } from 'tamagui';
import { useQuery } from '@tanstack/react-query';
import { getProgressData } from '@/lib/api';
import { LineChart, YAxis, Grid } from 'react-native-svg-charts';
import { useState } from 'react';

type Metric = 'weight' | 'bodyfat';

export default function MyProgressScreen() {
    const { data, isLoading } = useQuery({ queryKey: ['progressData'], queryFn: getProgressData });
    const [activeMetric, setActiveMetric] = useState<Metric>('weight');

    const renderChart = () => {
        if (isLoading) {
            return <ActivityIndicator />;
        }
        if (!data || !data[activeMetric] || data[activeMetric].length === 0) {
            return <Text>No {activeMetric} data logged yet.</Text>;
        }

        const chartData = data[activeMetric].map((d: any) => d.value);
        const contentInset = { top: 20, bottom: 20 };

        return (
            <View style={{ height: 200, flexDirection: 'row' }}>
                <YAxis
                    data={chartData}
                    contentInset={contentInset}
                    svg={{
                        fill: 'grey',
                        fontSize: 10,
                    }}
                    numberOfTicks={5}
                    formatLabel={(value) => `${value}${activeMetric === 'weight' ? 'kg' : '%'}`}
                />
                <LineChart
                    style={{ flex: 1, marginLeft: 16 }}
                    data={chartData}
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
                <ToggleGroup type="single" value={activeMetric} onValueChange={(val: Metric) => val && setActiveMetric(val)} orientation="horizontal" alignSelf='center'>
                    <ToggleGroup.Item value="weight">
                        <Label>Weight</Label>
                    </ToggleGroup.Item>
                    <ToggleGroup.Item value="bodyfat">
                        <Label>Body Fat</Label>
                    </ToggleGroup.Item>
                </ToggleGroup>
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
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 10,
    }
});
      