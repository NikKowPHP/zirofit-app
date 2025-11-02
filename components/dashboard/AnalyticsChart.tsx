import { Card } from '@/components/ui/Card';
import { View, Text } from '@/components/Themed';
import { YStack, H5 } from 'tamagui';
import { VictoryChart, VictoryBar, VictoryAxis } from 'victory-native';

type ChartData = {
    value: number;
    label: string;
};

type AnalyticsChartProps = {
    title: string;
    data: ChartData[];
};

export default function AnalyticsChart({ title, data }: AnalyticsChartProps) {
    const chartData = data.map((item, index) => ({ x: item.label, y: item.value }));

    return (
        <Card padding="$4">
            <YStack space="$3">
                <H5>{title}</H5>
                <VictoryChart height={200} domainPadding={{ x: 20 }}>
                     <VictoryBar data={chartData} style={{ data: { fill: 'rgba(134, 65, 244, 0.8)' } }} labels={({ datum }: { datum: { y: number } }) => datum.y} />
                     <VictoryAxis />
                     <VictoryAxis dependentAxis />
                 </VictoryChart>
            </YStack>
        </Card>
    );
}
      