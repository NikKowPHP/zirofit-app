import { Card } from '@/components/ui/Card';
import { View, Text } from '@/components/Themed';
import { YStack, H5 } from 'tamagui';
import { BarChart, Grid } from 'react-native-svg-charts';
import { Text as SvgText } from 'react-native-svg';

type ChartData = {
    value: number;
    label: string;
};

type AnalyticsChartProps = {
    title: string;
    data: ChartData[];
};

export default function AnalyticsChart({ title, data }: AnalyticsChartProps) {
    const chartData = data.map(item => item.value);
    const CUT_OFF = 20;
    const Labels = ({ x, y, bandwidth, data }: any) => (
        data.map((value: number, index: number) => (
            <SvgText
                key={index}
                x={x(index) + (bandwidth / 2)}
                y={value < CUT_OFF ? y(value) - 10 : y(value) + 15}
                fontSize={10}
                fill={value >= CUT_OFF ? 'white' : 'black'}
                alignmentBaseline={'middle'}
                textAnchor={'middle'}
            >
                {value}
            </SvgText>
        ))
    );

    return (
        <Card padding="$4">
            <YStack space="$3">
                <H5>{title}</H5>
                <View style={{ height: 200, padding: 10 }}>
                     <BarChart
                        style={{ flex: 1 }}
                        data={chartData}
                        svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                        contentInset={{ top: 20, bottom: 20 }}
                        spacingInner={0.2}
                    >
                        <Grid />
                        <Labels />
                    </BarChart>
                </View>
                 <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    {data.map(item => <Text key={item.label} style={{fontSize: 12, textAlign: 'center'}}>{item.label}</Text>)}
                </View>
            </YStack>
        </Card>
    );
}
      