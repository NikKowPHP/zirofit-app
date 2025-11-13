import { Card } from '@/components/ui/Card';
import { View, Text } from '@/components/Themed';
import { VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { VictoryChart, VictoryBar, VictoryAxis } from 'victory-native';
import { useTheme } from '@/hooks/useTheme';

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
        <Card>
            <VStack style={{ gap: 12 }}>
                <UIText variant="h5">{title}</UIText>
                <VictoryChart height={200} domainPadding={{ x: 20 }}>
                     <VictoryBar data={chartData} style={{ data: { fill: theme.primary } }} labels={({ datum }: { datum: { y: number } }) => datum.y} />
                     <VictoryAxis tickLabelComponent={<Text style={{ color: theme.textSecondary, fontSize: 12 }} />} />
                     <VictoryAxis dependentAxis tickLabelComponent={<Text style={{ color: theme.textSecondary, fontSize: 12 }} />} />
                 </VictoryChart>
            </VStack>
        </Card>
    );
}