import { Card } from '@/components/ui/Card';
import { View, Text } from '@/components/Themed';
import { YStack, H5 } from 'tamagui';
import { VictoryChart, VictoryBar, VictoryAxis } from 'victory-native';
import { useTheme } from 'tamagui';

type ChartData = {
    value: number;
    label: string;
};

type AnalyticsChartProps = {
    title: string;
    data: ChartData[];
};

export default function AnalyticsChart({ title, data }: AnalyticsChartProps) {
    const theme = useTheme();
    const chartData = data.map((item, index) => ({ x: item.label, y: item.value }));

    return (
        <Card padding="$4">
            <YStack space="$3">
                <H5>{title}</H5>
                <VictoryChart height={200} domainPadding={{ x: 20 }}>
                     <VictoryBar data={chartData} style={{ data: { fill: theme.primary.get() } }} labels={({ datum }: { datum: { y: number } }) => datum.y} />
                     <VictoryAxis tickLabelComponent={<Text style={{ color: theme.textSecondary.get(), fontSize: 12 }} />} />
                     <VictoryAxis dependentAxis tickLabelComponent={<Text style={{ color: theme.textSecondary.get(), fontSize: 12 }} />} />
                 </VictoryChart>
            </YStack>
        </Card>
    );
}