import React from 'react';
import { Modal as RNModal, ModalProps as RNModalProps, Platform, Pressable, StyleSheet } from 'react-native';
import { View, Text } from '@/components/Themed';
import { Button } from './Button';

interface ModalProps extends Omit<RNModalProps, 'presentationStyle'> {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}

export function Modal({ children, onClose, title, ...props }: ModalProps) {
  const presentationStyle = Platform.select({
    ios: 'pageSheet', // Presents as a dismissible sheet on iOS
    android: undefined, // Standard modal on Android
  }) as RNModalProps['presentationStyle'];

  return (
    <RNModal
      animationType="slide"
      presentationStyle={presentationStyle}
      onRequestClose={onClose}
      {...props}>
      <View style={styles.container}>
        <View style={styles.header}>
            {title && <Text style={styles.title}>{title}</Text>}
            <Pressable onPress={onClose} style={styles.closeButton}>
                <Text>Close</Text>
            </Pressable>
        </View>
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 40 : 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        padding: 15,
    }
})
      