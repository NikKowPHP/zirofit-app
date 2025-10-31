import { View, Text } from '@/components/Themed';
import { StyleSheet } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';

export default function EditProfileScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>
            <Text style={styles.subtitle}>This screen will contain forms to edit your profile, services, and packages.</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <EditScreenInfo path="app/(app)/(trainer)/(tabs)/profile/edit.tsx" />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
      