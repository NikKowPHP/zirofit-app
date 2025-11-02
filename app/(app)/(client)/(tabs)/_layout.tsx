import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function ClientTabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: Platform.OS === 'android' ? styles.androidTabBar : styles.iosTabBar,
        tabBarBackground: () => 
            Platform.OS === 'ios' ? 
            <BlurView tint={colorScheme ?? 'light'} intensity={90} style={StyleSheet.absoluteFill} /> : 
            null
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="log-workout"
        options={{
          title: 'Log Workout',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus-square" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <TabBarIcon name="history" color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => <TabBarIcon name="line-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-trainer"
        options={{
          title: 'Trainer',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
    iosTabBar: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        position: 'absolute',
    },
    androidTabBar: {
        backgroundColor: '#fff', // Replace with Material 3 color
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        elevation: 8,
    }
})
      