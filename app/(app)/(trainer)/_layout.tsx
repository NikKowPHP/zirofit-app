import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '@/hooks/useTheme';
import { SyncStatusIndicator } from '@/components/ui/SyncStatusIndicator';

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TrainerTabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        headerShown: true,
        headerRight: () => <SyncStatusIndicator />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          // Hidden redirect route
          href: null,
        }}
      />
      <Tabs.Screen
        name="(tabs)/dashboard/index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon name="tachometer" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(tabs)/clients"
        options={{
          title: 'Clients',
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(tabs)/calendar/index"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
        }}
      />
       <Tabs.Screen
        name="(tabs)/programs"
        options={{
          title: 'Programs',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
       <Tabs.Screen
        name="(tabs)/profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user-circle" color={color} />,
        }}
      />
    </Tabs>
  );
}