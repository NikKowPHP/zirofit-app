import { View, Text } from '@/components/Themed';
import { StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H3, YStack, ToggleGroup, Label, H5, XStack } from 'tamagui';
import { useQuery } from '@tanstack/react-query';
import { getProgressData, getClientAssessments } from '@/lib/api';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';

type Metric = 'weight' | 'bodyfat';
type ActiveTab = Metric | 'assessments';

export default function MyProgressScreen() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('weight');

    const { data: progressData, isLoading: isProgressLoading } = useQuery({ 
        queryKey: ['progressData'], 
        queryFn: getProgressData,
        enabled: activeTab === 'weight' || activeTab === 'bodyfat',
    });

    const { data: assessments, isLoading: areAssessmentsLoading } = useQuery({
        queryKey: ['assessments'],
        queryFn: getClientAssessments,
        enabled: activeTab === 'assessments',
    });

    const renderChart = () => {
        if (isProgressLoading) {
            return <ActivityIndicator />;
        }
        if (!progressData || !progressData[activeTab] || progressData[activeTab].length === 0) {
            return <Text>No {activeTab} data logged yet.</Text>;
        }

        const data = progressData[activeTab].map((d: any, index: number) => ({ x: index, y: d.value }));

        return (
            <VictoryChart height={200} padding={{ top: 20, bottom: 60, left: 60, right: 20 }}>
                <VictoryLine data={data} style={{ data: { stroke: 'rgb(134, 65, 244)' } }} />
                <VictoryAxis dependentAxis tickFormat={(t) => `${t}${activeTab === 'weight' ? 'kg' : '%'}`} />
                <VictoryAxis />
            </VictoryChart>
        );
    };

    const renderAssessments = () => {
        if (areAssessmentsLoading) {
            return <ActivityIndicator />;
        }
        if (!assessments || assessments.length === 0) {
            return <Text>No assessments found.</Text>;
        }

        return (
            <ScrollView style={{width: '100%'}}>
                <YStack space="$3">
                    {assessments.map((assessment: any) => (
                        <Card key={assessment.id} padding="$3">
                            <H5>{assessment.name}</H5>
                            <Text style={styles.dateText}>{new Date(assessment.date).toDateString()}</Text>
                             {assessment.metrics.map((metric: any) => (
                                <XStack key={metric.id} justifyContent='space-between' my="$1">
                                    <Text>{metric.name}:</Text>
                                    <Text style={styles.metricValue}>{metric.value} {metric.unit}</Text>
                                </XStack>
                            ))}
                        </Card>
                    ))}
                </YStack>
            </ScrollView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" padding="$4" flex={1}>
                <H3>My Progress</H3>
                <ToggleGroup type="single" value={activeTab} onValueChange={(val: ActiveTab) => val && setActiveTab(val)} orientation="horizontal" alignSelf='center'>
                    <ToggleGroup.Item value="weight">
                        <Label>Weight</Label>
                    </ToggleGroup.Item>
                    <ToggleGroup.Item value="bodyfat">
                        <Label>Body Fat</Label>
                    </ToggleGroup.Item>
                    <ToggleGroup.Item value="assessments">
                        <Label>Assessments</Label>
                    </ToggleGroup.Item>
                </ToggleGroup>
                <View style={styles.contentContainer}>
                    {activeTab === 'assessments' ? renderAssessments() : renderChart()}
                </View>
            </YStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 10,
    },
    dateText: {
        color: 'gray',
        marginBottom: 10,
    },
    metricValue: {
        fontWeight: 'bold',
    }
});
      