import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useClientDetails } from '@/hooks/useClientDetails';
import { useTheme } from '@/hooks/useTheme';
import type { Client } from '@/lib/api/types';

const { Navigator } = createMaterialTopTabNavigator();

function ClientHeader() {
  const { id } = useLocalSearchParams();
  const { data: client, isOffline } = useClientDetails(id as string);
  const theme = useTheme();

  console.log('ClientHeader - Client ID:', id);
  console.log('ClientHeader - Client data:', client);
  console.log('ClientHeader - Client name:', (client as Client)?.name);
  console.log('ClientHeader - Is offline mode:', isOffline);

  return (
    <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
      <View style={styles.titleRow}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Client: {(client as Client)?.name || 'Loading...'}
        </Text>
        {isOffline && (
          <Text style={[styles.offlineBadge, { color: theme.primary }]}>
            📱 Offline
          </Text>
        )}
      </View>
      {client ? (
        <View style={styles.clientDetails}>
          {(client as Client)?.goals ? (
            <Text style={[styles.clientDetail, { color: theme.text }]}>🎯 Goals: {(client as Client).goals}</Text>
          ) : null}
          {(client as Client)?.status ? (
            <Text style={[styles.clientDetail, { color: theme.text }]}>
              📊 Status: {(client as Client).status}
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  offlineBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    opacity: 0.8,
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
      