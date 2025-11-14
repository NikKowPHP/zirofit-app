import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useClientDetails } from '@/hooks/useClientDetails';
import { useTheme } from '@/hooks/useTheme';

const { Navigator } = createMaterialTopTabNavigator();

function ClientHeader() {
  const { id } = useLocalSearchParams();
  const { data: client } = useClientDetails(id as string);
  const theme = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
      <Text style={[styles.headerTitle, { color: theme.text }]}>Client: {client?.name || 'Loading...'}</Text>
    </View>
  );
}

export const MaterialTopTabs = withLayoutContext(Navigator);

export default function ClientDetailLayout() {
  const theme = useTheme();

  return (
    <>
      <ClientHeader />
      <MaterialTopTabs
        screenOptions={{
          tabBarStyle: { backgroundColor: theme.background },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarIndicatorStyle: { backgroundColor: theme.primary },
        }}
      >
        <MaterialTopTabs.Screen name="index" options={{ title: 'Workouts' }} />
        <MaterialTopTabs.Screen name="live" options={{ title: 'Live' }} />
        <MaterialTopTabs.Screen name="measurements" options={{ title: 'Measurements' }} />
        <MaterialTopTabs.Screen name="photos" options={{ title: 'Photos' }} />
      </MaterialTopTabs>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
      