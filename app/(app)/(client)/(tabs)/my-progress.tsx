import { View, Text } from '@/components/Themed';
import { StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack, HStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory-native';
import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import type { ProgressData, ClientAssessment } from '@/lib/api/types';
import useAuthStore from '@/store/authStore';
import { useTheme, useTokens } from '@/hooks/useTheme';
import { clientMeasurementRepository } from '@/lib/repositories/clientMeasurementRepository';
import { clientAssessmentRepository } from '@/lib/repositories/clientAssessmentRepository';
import withObservables from '@nozbe/with-observables';
import { combineLatest, map } from 'rxjs/operators';
import { of, combineLatest as combineLatestStatic } from 'rxjs';

type Metric = 'weight' | 'bodyfat';
type ActiveTab = Metric | 'assessments';

function MyProgressScreen({ measurements, assessments }: {
  measurements: any[],
  assessments: any[]
}) {
    const [activeTab, setActiveTab] = useState<ActiveTab>('weight');
    const { user } = useAuthStore();
    const theme = useTheme();
    const tokens = useTokens();

    // Filter data for current user
    const userMeasurements = useMemo(() => {
        if (!user?.id) return [];
        return measurements.filter(m => m.clientId === user.id);
    }, [measurements, user?.id]);

    const userAssessments = useMemo(() => {
        if (!user?.id) return [];
        return assessments.filter(a => a.clientId === user.id);
    }, [assessments, user?.id]);

    // Create chart data from measurements
    const progressData = useMemo(() => {
        const weightData = userMeasurements
            .filter(m => m.measurementType === 'weight')
            .sort((a, b) => a.measuredAt - b.measuredAt)
            .map((m, index) => ({ x: index, y: m.value, date: new Date(m.measuredAt) }));

        const bodyFatData = userMeasurements
            .filter(m => m.measurementType === 'body_fat')
            .sort((a, b) => a.measuredAt - b.measuredAt)
            .map((m, index) => ({ x: index, y: m.value, date: new Date(m.measuredAt) }));

        return {
            weight: weightData,
            bodyfat: bodyFatData
        };
    }, [userMeasurements]);

    const renderChart = () => {
        if (!progressData[activeTab as 'weight' | 'bodyfat'] || progressData[activeTab as 'weight' | 'bodyfat'].length === 0) {
            return <Text>No {activeTab} data logged yet.</Text>;
        }

        const data = progressData[activeTab as 'weight' | 'bodyfat'];

        return (
            <VictoryChart height={200} padding={{ top: 20, bottom: 60, left: 60, right: 20 }}>
                <VictoryLine data={data} style={{ data: { stroke: 'rgb(134, 65, 244)' } }} />
                <VictoryAxis dependentAxis tickFormat={(t) => `${t}${activeTab === 'weight' ? 'kg' : '%'}`} />
                <VictoryAxis />
            </VictoryChart>
        );
    };

    const renderAssessments = () => {
        if (!userAssessments || userAssessments.length === 0) {
            return <Text>No assessments found.</Text>;
        }

        return (
            <ScrollView style={{width: '100%'}}>
                <VStack style={{ gap: 12 }}>
                    {userAssessments.map((assessment: any) => (
                        <Card key={assessment.id} style={{ padding: 12 }}>
                            <UIText variant="h5">Assessment</UIText>
                            <Text style={styles.dateText}>{new Date(assessment.assessmentDate).toDateString()}</Text>
                            {assessment.weight && (
                                <HStack style={{ justifyContent: 'space-between', marginVertical: 4 }}>
                                    <Text>Weight:</Text>
                                    <Text style={styles.metricValue}>{assessment.weight} kg</Text>
                                </HStack>
                            )}
                            {assessment.bodyFatPercentage && (
                                <HStack style={{ justifyContent: 'space-between', marginVertical: 4 }}>
                                    <Text>Body Fat:</Text>
                                    <Text style={styles.metricValue}>{assessment.bodyFatPercentage}%</Text>
                                </HStack>
                            )}
                            {assessment.notes && (
                                <Text style={{ marginTop: 8, fontStyle: 'italic' }}>{assessment.notes}</Text>
                            )}
                        </Card>
                    ))}
                </VStack>
            </ScrollView>
        )
    }

    if (!user?.id) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <VStack style={{ padding: 16, gap: 16, flex: 1 }}>
                <UIText variant="h3">My Progress</UIText>
                <HStack style={{ alignSelf: 'center', gap: 8 }}>
                    {(['weight', 'bodyfat', 'assessments'] as ActiveTab[]).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[
                                styles.tabButton,
                                activeTab === tab && { backgroundColor: theme.primary }
                            ]}
                        >
                            <Text style={[
                                styles.tabText,
                                activeTab === tab && { color: theme.primaryForeground }
                            ]}>
                                {tab === 'bodyfat' ? 'Body Fat' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </HStack>
                <View style={styles.contentContainer}>
                    {activeTab === 'assessments' ? renderAssessments() : renderChart()}
                </View>
            </VStack>
        </SafeAreaView>
    );
}

const enhance = withObservables([], () => ({
  measurements: clientMeasurementRepository.observeClientMeasurements(),
  assessments: clientAssessmentRepository.observeClientAssessments(),
}));

export default enhance(MyProgressScreen);

const styles = StyleSheet.create({
    container: { flex: 1 },
    tabButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    tabText: {
        fontWeight: '600',
    },
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
      