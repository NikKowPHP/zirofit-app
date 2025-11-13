import { View, Text } from '@/components/Themed';
import { StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack, HStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { useQuery } from '@tanstack/react-query';
import { getProgressData, getClientAssessments } from '@/lib/api';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory-native';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import type { ProgressData, ClientAssessment } from '@/lib/api/types';
import useAuthStore from '@/store/authStore';
import { useTheme, useTokens } from '@/hooks/useTheme';

type Metric = 'weight' | 'bodyfat';
type ActiveTab = Metric | 'assessments';

export default function MyProgressScreen() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('weight');
    const { profile } = useAuthStore();
    const theme = useTheme();
    const tokens = useTokens();

    const { data: progressData, isLoading: isProgressLoading } = useQuery<ProgressData>({ 
        queryKey: ['progressData'], 
        queryFn: () => getProgressData(),
        enabled: activeTab === 'weight' || activeTab === 'bodyfat',
    });

    const { data: assessments, isLoading: areAssessmentsLoading } = useQuery<ClientAssessment[]>({
        queryKey: ['assessments', profile?.id],
        queryFn: ({ queryKey }) => getClientAssessments(queryKey[1] as string),
        enabled: activeTab === 'assessments' && !!profile?.id,
    });

    const renderChart = () => {
        if (isProgressLoading) {
            return <ActivityIndicator />;
        }
        if (!progressData || !progressData[activeTab as keyof ProgressData] || (progressData as any)[activeTab]?.length === 0) {
            return <Text>No {activeTab} data logged yet.</Text>;
        }

        const data = (progressData as any)[activeTab].map((d: any, index: number) => ({ x: index, y: d.value }));

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
        if (!assessments || (assessments as any[]).length === 0) {
            return <Text>No assessments found.</Text>;
        }

        return (
            <ScrollView style={{width: '100%'}}>
                <VStack style={{ gap: 12 }}>
                    {(assessments as any[]).map((assessment: any) => (
                        <Card key={assessment.id} style={{ padding: 12 }}>
                            <UIText variant="h5">{assessment.name}</UIText>
                            <Text style={styles.dateText}>{new Date(assessment.date).toDateString()}</Text>
                             {(assessment.metrics as any[]).map((metric: any) => (
                                <HStack key={metric.id} style={{ justifyContent: 'space-between', marginVertical: 4 }}>
                                    <Text>{metric.name}:</Text>
                                    <Text style={styles.metricValue}>{metric.value} {metric.unit}</Text>
                                </HStack>
                            ))}
                        </Card>
                    ))}
                </VStack>
            </ScrollView>
        )
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
      