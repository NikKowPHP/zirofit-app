import { View, StyleSheet, ViewProps } from 'react-native';

export const VStack = (props: ViewProps) => <View {...props} style={[styles.vstack, props.style]} />;
export const HStack = (props: ViewProps) => <View {...props} style={[styles.hstack, props.style]} />;

const styles = StyleSheet.create({
  vstack: { flexDirection: 'column' },
  hstack: { flexDirection: 'row', alignItems: 'center' },
});
