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

  console.log('ClientHeader - Client ID:', id);
  console.log('ClientHeader - Client data:', client);
  console.log('ClientHeader - Client name:', client?.name);

  return (
    <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
      <Text style={[styles.headerTitle, { color: theme.text }]}>Client: {client?.name || 'Loading...'}</Text>
      {client ? (
        <View style={styles.clientDetails}>
          {client?.goals ? (
            <Text style={[styles.clientDetail, { color: theme.text }]}>🎯 Goals: {client.goals}</Text>
          ) : null}
          {client?.status ? (
            <Text style={[styles.clientDetail, { color: theme.text }]}>
              📊 Status: {client.status}
            </Text>
          ) : null}
        </View>
      ) : (
        <View style={styles.clientDetails}>
          <Text style={[styles.clientDetail, { color: theme.textSecondary }]}>Loading client details…</Text>
        </View>
      )}
    </View>
  );
}

export const MaterialTopTabs = withLayoutContext(Navigator);

export default function ClientDetailLayout() {
  const { id } = useLocalSearchParams();
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
        <MaterialTopTabs.Screen name="index" options={{ title: 'Workouts' }} initialParams={{ id }} />
        <MaterialTopTabs.Screen name="live" options={{ title: 'Live' }} initialParams={{ id }} />
        <MaterialTopTabs.Screen name="measurements" options={{ title: 'Measurements' }} initialParams={{ id }} />
        <MaterialTopTabs.Screen name="photos" options={{ title: 'Photos' }} initialParams={{ id }} />
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
  clientDetails: {
    marginTop: 8,
    gap: 4,
  },
  clientDetail: {
    fontSize: 14,
    opacity: 0.8,
  },
});
      