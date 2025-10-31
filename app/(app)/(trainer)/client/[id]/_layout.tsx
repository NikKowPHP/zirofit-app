import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext(Navigator);

export default function ClientDetailLayout() {
  return (
    <MaterialTopTabs>
      <MaterialTopTabs.Screen name="index" options={{ title: 'Workouts' }} />
      <MaterialTopTabs.Screen name="measurements" options={{ title: 'Measurements' }} />
      <MaterialTopTabs.Screen name="photos" options={{ title: 'Photos' }} />
    </MaterialTopTabs>
  );
}
      